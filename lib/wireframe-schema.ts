export const wireframeSchema = {
  type: "object",

  properties: {
    title: {
      type: "string",
    },

    pageKind: {
      type: "string",
      enum: [
        "landing",
        "saas",
        "ecommerce",
        "portfolio",
        "restaurant",
        "booking",
        "dashboard",
        "service",
        "other",
      ],
    },

    design: {
      type: "object",

      properties: {
        theme: {
          type: "string",
          enum: ["light", "dark"],
        },

        mood: {
          type: "string",
          enum: [
            "minimal",
            "modern",
            "bold",
            "luxury",
            "playful",
            "editorial",
            "corporate",
            "warm",
            "technical",
          ],
        },

        accent: {
          type: "string",
          enum: [
            "cyan",
            "blue",
            "violet",
            "emerald",
            "rose",
            "orange",
            "amber",
            "red",
            "neutral",
          ],
        },

        spacing: {
          type: "string",
          enum: ["compact", "normal", "spacious"],
        },

        radius: {
          type: "string",
          enum: ["none", "small", "medium", "large"],
        },

        typography: {
          type: "string",
          enum: ["clean", "bold", "editorial", "technical"],
        },
      },

      required: [
        "theme",
        "mood",
        "accent",
        "spacing",
        "radius",
        "typography",
      ],

      additionalProperties: false,
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
              "stats",
              "showcase",
              "pricing",
              "testimonials",
              "faq",
              "cta",
              "contact",
              "footer",
            ],
          },

          variant: {
            type: "string",
            enum: [
              "simple",
              "centered",
              "split",
              "cards",
              "grid",
              "editorial",
              "band",
              "minimal",
            ],
          },

          surface: {
            type: "string",
            enum: ["base", "muted", "accent", "inverse"],
          },

          alignment: {
            type: "string",
            enum: ["left", "center"],
          },

          visual: {
            type: "string",
            enum: [
              "none",
              "abstract",
              "product",
              "dashboard",
              "phone",
              "gallery",
              "cards",
            ],
          },

          eyebrow: {
            type: "string",
          },

          heading: {
            type: "string",
          },

          body: {
            type: "string",
          },

          primaryButton: {
            type: "string",
          },

          secondaryButton: {
            type: "string",
          },

          items: {
            type: "array",

            items: {
              type: "object",

              properties: {
                title: {
                  type: "string",
                },

                description: {
                  type: "string",
                },

                meta: {
                  type: "string",
                },
              },

              required: ["title", "description", "meta"],
              additionalProperties: false,
            },
          },
        },

        required: [
          "type",
          "variant",
          "surface",
          "alignment",
          "visual",
          "eyebrow",
          "heading",
          "body",
          "primaryButton",
          "secondaryButton",
          "items",
        ],

        additionalProperties: false,
      },
    },
  },

  required: ["title", "pageKind", "design", "sections"],
  additionalProperties: false,
} as const;