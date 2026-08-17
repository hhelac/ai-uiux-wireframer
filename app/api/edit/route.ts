import OpenAI from "openai";
import { NextResponse } from "next/server";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const editPrompt = body.editPrompt;
    const currentWireframe = body.wireframe;

    if (!editPrompt || typeof editPrompt !== "string") {
      return NextResponse.json(
        { error: "Edit prompt is required." },
        { status: 400 }
      );
    }

    if (!currentWireframe) {
      return NextResponse.json(
        { error: "Current wireframe is required." },
        { status: 400 }
      );
    }

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are an expert UI/UX designer editing an existing website wireframe.

The user will provide:
1. The current wireframe as JSON.
2. A requested design change.

Modify the existing wireframe according to the user's request.

Important rules:
- Preserve everything that the user did not ask to change.
- Do not unnecessarily regenerate the whole design.
- Keep the existing logical section order unless the user asks to change it.
- You may add or remove sections if explicitly requested.
- You may ONLY use these section types:
  navbar
  hero
  features
  pricing
  testimonials
  cta
  footer
- Return the COMPLETE updated wireframe.
          `,
        },

        {
          role: "user",
          content: `
CURRENT WIREFRAME:

${JSON.stringify(currentWireframe, null, 2)}

REQUESTED CHANGE:

${editPrompt}
          `,
        },
      ],

      response_format: {
        type: "json_schema",

        json_schema: {
          name: "wireframe",
          strict: true,

          schema: {
            type: "object",

            properties: {
              title: {
                type: "string",
              },

              sections: {
                type: "array",

                items: {
                  type: "object",

                  properties: {
                    type: {
                      type: "string",
                      enum: [
                        "navbar",
                        "hero",
                        "features",
                        "pricing",
                        "testimonials",
                        "cta",
                        "footer",
                      ],
                    },

                    heading: {
                      type: "string",
                    },

                    body: {
                      type: "string",
                    },

                    buttonText: {
                      type: "string",
                    },

                    items: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },

                  required: [
                    "type",
                    "heading",
                    "body",
                    "buttonText",
                    "items",
                  ],

                  additionalProperties: false,
                },
              },
            },

            required: ["title", "sections"],

            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0].message.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI did not return an updated wireframe." },
        { status: 500 }
      );
    }

    const updatedWireframe = JSON.parse(content);

    return NextResponse.json(updatedWireframe);
  } catch (error) {
    console.error("Edit wireframe error:", error);

    return NextResponse.json(
      { error: "Failed to edit wireframe." },
      { status: 500 }
    );
  }
}