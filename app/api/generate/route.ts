import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      reasoning_effort: "low",
      include_reasoning: false,

      messages: [
        {
          role: "system",
          content: `
You are an expert UI/UX designer.

Convert the user's request into a structured website wireframe.

Create between 4 and 7 logical sections.

Allowed section types:
- navbar
- hero
- features
- pricing
- testimonials
- cta
- footer

Rules:
- Return only data matching the provided JSON schema.
- Do not include explanations.
- Do not include markdown.
- Do not include reasoning.
- Do not include text before or after the JSON.
- Keep headings concise.
- Write realistic website content.
- Every section MUST contain all five fields:
  type, heading, body, buttonText, items.
- Use an empty string when body or buttonText is not needed.
- Use an empty array when items are not needed.
- Each item in items MUST be a normal string.
- Build sections in a logical website order.
          `,
        },
        {
          role: "user",
          content: prompt,
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

      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI did not return a wireframe." },
        { status: 500 }
      );
    }

    const wireframe = JSON.parse(content);

    return NextResponse.json(wireframe);
  } catch (error) {
    console.error("Generate wireframe error:", error);

    return NextResponse.json(
      { error: "Failed to generate wireframe." },
      { status: 500 }
    );
  }
}