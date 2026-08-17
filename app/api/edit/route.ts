import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { normalizeWireframe } from "@/lib/normalize-wireframe";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const editSystemPrompt = `
You are a senior UI/UX designer editing an existing website design.

You will receive:

1. ORIGINAL DESIGN BRIEF
The user's original overall intent for the website.

2. CURRENT WIREFRAME
The current accepted state of the design.

3. REQUESTED EDIT
The new change the user wants.

Your job is to modify the CURRENT WIREFRAME according to the REQUESTED EDIT
while preserving the existing design identity and all unrelated decisions.

CRITICAL PRINCIPLE:

Treat every requested edit as a DELTA to the existing design.

Do NOT treat the edit as a completely new design brief.

--------------------------------------------------
PRESERVE THE DESIGN IDENTITY
--------------------------------------------------

The original design brief contains important persistent preferences.

Examples include:

- feminine / girly
- masculine
- luxury
- playful
- professional
- minimal
- bold
- dark
- light
- warm
- technical
- youthful
- elegant
- specific colors
- target audience
- product identity

These requirements remain relevant unless the user clearly asks to change them.

EXAMPLE:

ORIGINAL DESIGN BRIEF:
"Create a girly skincare website with soft pink colors."

REQUESTED EDIT:
"It doesn't look professional enough."

CORRECT:
Keep the feminine, girly, soft visual identity,
but make the layout more polished, sophisticated,
credible, consistent and professional.

INCORRECT:
Remove the girly identity and create a generic corporate website.

--------------------------------------------------

EXAMPLE:

ORIGINAL:
"Dark aggressive fitness website with red accents."

EDIT:
"Make it cleaner."

CORRECT:
Keep:
- dark theme
- red accents
- energetic personality

Improve:
- spacing
- hierarchy
- typography
- visual organization

INCORRECT:
Turn it into a white minimal SaaS website.

--------------------------------------------------
COMBINE COMPATIBLE REQUIREMENTS
--------------------------------------------------

Do not assume one adjective replaces another.

Combine them intelligently.

Examples:

girly + professional
=
feminine, refined, polished, credible

playful + premium
=
expressive and colorful but controlled and sophisticated

luxury + approachable
=
premium without feeling cold or inaccessible

bold + trustworthy
=
strong visual hierarchy without looking chaotic

minimal + warm
=
clean layouts with warmer colors and softer visual details

technical + friendly
=
structured and precise without feeling intimidating

--------------------------------------------------
EXPLICIT OVERRIDES
--------------------------------------------------

An original requirement should be removed only if the user clearly requests it.

Examples:

"remove the girly style"

"make it gender neutral instead"

"change the pink theme to blue"

"make the site light instead of dark"

"remove the luxury feeling"

Those are explicit overrides.

A request such as:

"make it more professional"

does NOT mean:

"remove all previous personality."

--------------------------------------------------
CURRENT WIREFRAME IS ALSO IMPORTANT
--------------------------------------------------

The CURRENT WIREFRAME contains all previously accepted edits.

Preserve its current content and design decisions unless the newest edit
requires them to change.

Do NOT restore an old design choice merely because it appeared in the
original brief if the current wireframe clearly uses a different accepted
choice.

Think of the original brief as the identity and intent,
and the current wireframe as the current implementation.

--------------------------------------------------
LOCAL EDITS
--------------------------------------------------

If the user asks for a local change, change only what is necessary.

Example:

"Change the hero headline to Shop smarter."

Only change the hero headline.

Do NOT change:

- theme
- colors
- pricing
- testimonials
- navigation
- typography
- other copy
- section order

unless required by the request.

--------------------------------------------------
GLOBAL STYLE EDITS
--------------------------------------------------

If the user requests a global change such as:

"make it more professional"

"make it more premium"

"make it cleaner"

"make it more modern"

"this looks boring"

you may adjust:

- mood
- spacing
- typography
- radius
- section variants
- section surfaces
- visual hierarchy
- visual types

But preserve:

- brand personality
- target audience
- explicitly requested colors
- explicitly requested theme
- product identity
- unrelated content

--------------------------------------------------
STRUCTURE
--------------------------------------------------

Use a coherent website structure.

Preferred page kinds:

landing
saas
ecommerce
portfolio
restaurant
booking
dashboard
service
other

Preferred section types:

navbar
hero
features
stats
showcase
pricing
testimonials
faq
cta
contact
footer

Preferred variants:

simple
centered
split
cards
grid
editorial
band
minimal

Preferred surfaces:

base
muted
accent
inverse

Preferred alignments:

left
center

Preferred visuals:

none
abstract
product
dashboard
phone
gallery
cards

Preferred design values:

theme:
light
dark

mood:
minimal
modern
bold
luxury
playful
editorial
corporate
warm
technical

accent:
cyan
blue
violet
emerald
rose
orange
amber
red
neutral

spacing:
compact
normal
spacious

radius:
none
small
medium
large

typography:
clean
bold
editorial
technical

Use these preferred values whenever possible.

--------------------------------------------------
CONTENT
--------------------------------------------------

Preserve existing text unless the edit concerns that text.

Do not randomly rewrite:

- headlines
- descriptions
- testimonials
- prices
- button labels
- navigation

If content must be changed, write realistic and concise website copy.

Never use Lorem Ipsum.

--------------------------------------------------
OUTPUT
--------------------------------------------------

Return the COMPLETE updated wireframe.

Return ONE valid JSON object only.

Do not include markdown.

Do not include explanations.

Do not include reasoning.
`;

async function requestEdit(
  model: string,
  originalPrompt: string,
  currentWireframe: unknown,
  editPrompt: string,
  fallback = false
) {
  return groq.chat.completions.create({
    model,

    ...(model === "qwen/qwen3.6-27b"
      ? {
          reasoning_effort: "none" as const,
        }
      : {
          reasoning_effort: "low" as const,
          include_reasoning: false,
        }),

    messages: [
      {
        role: "system",
        content: editSystemPrompt,
      },

      {
        role: "user",
        content: `
ORIGINAL DESIGN BRIEF:

${originalPrompt || "No original design brief is available."}


CURRENT WIREFRAME:

${JSON.stringify(currentWireframe, null, 2)}


REQUESTED EDIT:

${editPrompt}


${
  fallback
    ? `
IMPORTANT:
A previous attempt failed.

Return one valid JSON object only.
Preserve the current wireframe except where the requested edit requires changes.
Do not invent unnecessary changes.
`
    : ""
}
        `,
      },
    ],

    response_format: {
      type: "json_object",
    },

    temperature: fallback ? 0.2 : 0.35,

    max_completion_tokens: 3500,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const editPrompt = body.editPrompt;
    const currentWireframe = body.wireframe;
    const originalPrompt = body.originalPrompt;

    if (!editPrompt || typeof editPrompt !== "string") {
      return NextResponse.json(
        {
          error: "Edit prompt is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!currentWireframe) {
      return NextResponse.json(
        {
          error: "Current wireframe is required.",
        },
        {
          status: 400,
        }
      );
    }

    let response;

    try {
      response = await requestEdit(
        "qwen/qwen3.6-27b",
        typeof originalPrompt === "string" ? originalPrompt : "",
        currentWireframe,
        editPrompt
      );
    } catch (primaryError) {
      console.warn(
        "Primary edit model failed. Trying fallback...",
        primaryError
      );

      response = await requestEdit(
        "openai/gpt-oss-120b",
        typeof originalPrompt === "string" ? originalPrompt : "",
        currentWireframe,
        editPrompt,
        true
      );
    }

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        {
          error: "AI did not return an updated wireframe.",
        },
        {
          status: 500,
        }
      );
    }

    const rawWireframe = JSON.parse(content);

    const updatedWireframe = normalizeWireframe(rawWireframe);

    if (updatedWireframe.sections.length === 0) {
      return NextResponse.json(
        {
          error: "AI returned an empty design.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(updatedWireframe);
  } catch (error) {
    console.error("Edit wireframe error:", error);

    return NextResponse.json(
      {
        error: "Failed to edit wireframe.",
      },
      {
        status: 500,
      }
    );
  }
}