import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { normalizeWireframe } from "@/lib/normalize-wireframe";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = `
You are a senior UI/UX designer.

Transform the user's request into a polished website design specification.

The user does NOT need to know UI/UX terminology.
Their request may be vague, informal or extremely short.

Examples:
"luxury watch brand"
"website za pekaru"
"gym app"
"something nice for my company"

You must infer sensible missing design decisions.

PRIORITY:

1. Respect explicit user requirements.
2. Infer from product, audience and purpose.
3. Use strong professional defaults.

Return one JSON object.

The JSON should have this general structure:

{
  "title": "...",

  "pageKind": "...",

  "design": {
    "theme": "...",
    "mood": "...",
    "accent": "...",
    "spacing": "...",
    "radius": "...",
    "typography": "..."
  },

  "sections": [
    {
      "type": "...",
      "variant": "...",
      "surface": "...",
      "alignment": "...",
      "visual": "...",

      "eyebrow": "...",
      "heading": "...",
      "body": "...",

      "primaryButton": "...",
      "secondaryButton": "...",

      "items": [
        {
          "title": "...",
          "description": "...",
          "meta": "..."
        }
      ]
    }
  ]
}

PREFERRED PAGE KINDS:

landing
saas
ecommerce
portfolio
restaurant
booking
dashboard
service
other

PREFERRED SECTION TYPES:

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

PREFERRED VARIANTS:

simple
centered
split
cards
grid
editorial
band
minimal

PREFERRED SURFACES:

base
muted
accent
inverse

PREFERRED ALIGNMENTS:

left
center

PREFERRED VISUALS:

none
abstract
product
dashboard
phone
gallery
cards

PREFERRED DESIGN VALUES:

theme:
light, dark

mood:
minimal, modern, bold, luxury, playful,
editorial, corporate, warm, technical

accent:
cyan, blue, violet, emerald, rose,
orange, amber, red, neutral

spacing:
compact, normal, spacious

radius:
none, small, medium, large

typography:
clean, bold, editorial, technical

These are preferred values.
Use them whenever possible.

DESIGN QUALITY:

- Build a real information hierarchy.
- Do not blindly use every possible section.
- Usually create 5 to 9 sections.
- Make the design appropriate to the actual product.
- Avoid repetitive layouts.
- Use different surfaces when useful.
- Use strong, realistic copy.
- Never use Lorem Ipsum.
- Never use meaningless labels like Feature 1.
- Keep CTA labels concise.
- Make the design visually coherent.

If the prompt is vague, make confident professional decisions yourself.

Return JSON only.
Do not include markdown.
Do not explain anything.
Do not include reasoning.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          error: "Prompt is required.",
        },
        {
          status: 400,
        }
      );
    }

    let response;

try {
  response = await groq.chat.completions.create({
    model: "qwen/qwen3.6-27b",

    reasoning_effort: "none",

    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    response_format: {
      type: "json_object",
    },

    temperature: 0.5,
    max_completion_tokens: 3500,
  });
} catch (primaryError) {
  console.warn(
    "Qwen generation failed, trying fallback model...",
    primaryError
  );

  response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",

    reasoning_effort: "low",
    include_reasoning: false,

    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    response_format: {
      type: "json_object",
    },

    temperature: 0.3,
    max_completion_tokens: 3500,
  });
}

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        {
          error: "AI did not return a wireframe.",
        },
        {
          status: 500,
        }
      );
    }

    const rawWireframe = JSON.parse(content);

    const wireframe = normalizeWireframe(rawWireframe);

    if (wireframe.sections.length === 0) {
      return NextResponse.json(
        {
          error: "AI returned an empty design.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(wireframe);
  } catch (error) {
    console.error("Generate wireframe error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate wireframe.",
      },
      {
        status: 500,
      }
    );
  }
}