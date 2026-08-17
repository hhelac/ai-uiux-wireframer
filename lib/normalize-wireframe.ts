import type {
  AccentColor,
  Alignment,
  DesignSystem,
  Mood,
  PageKind,
  Radius,
  SectionSurface,
  SectionType,
  SectionVariant,
  Spacing,
  Theme,
  Typography,
  VisualType,
  Wireframe,
  WireframeItem,
  WireframeSection,
} from "@/types/wireframe";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizePageKind(value: unknown): PageKind {
  const raw = text(value).toLowerCase();

  const allowed: PageKind[] = [
    "landing",
    "saas",
    "ecommerce",
    "portfolio",
    "restaurant",
    "booking",
    "dashboard",
    "service",
    "other",
  ];

  if (allowed.includes(raw as PageKind)) {
    return raw as PageKind;
  }

  if (raw.includes("shop") || raw.includes("store")) return "ecommerce";
  if (raw.includes("portfolio")) return "portfolio";
  if (raw.includes("restaurant") || raw.includes("food")) return "restaurant";
  if (raw.includes("book")) return "booking";
  if (raw.includes("dashboard")) return "dashboard";
  if (raw.includes("saas")) return "saas";

  return "landing";
}

function normalizeTheme(value: unknown): Theme {
  return text(value).toLowerCase().includes("dark") ? "dark" : "light";
}

function normalizeMood(value: unknown): Mood {
  const raw = text(value).toLowerCase();

  const allowed: Mood[] = [
    "minimal",
    "modern",
    "bold",
    "luxury",
    "playful",
    "editorial",
    "corporate",
    "warm",
    "technical",
  ];

  if (allowed.includes(raw as Mood)) {
    return raw as Mood;
  }

  if (
    raw.includes("premium") ||
    raw.includes("elegant") ||
    raw.includes("sophisticated")
  ) {
    return "luxury";
  }

  if (raw.includes("professional")) return "corporate";
  if (raw.includes("friendly") || raw.includes("fun")) return "playful";
  if (raw.includes("tech")) return "technical";
  if (raw.includes("clean")) return "minimal";

  return "modern";
}

function normalizeAccent(value: unknown): AccentColor {
  const raw = text(value).toLowerCase();

  const allowed: AccentColor[] = [
    "cyan",
    "blue",
    "violet",
    "emerald",
    "rose",
    "orange",
    "amber",
    "red",
    "neutral",
  ];

  if (allowed.includes(raw as AccentColor)) {
    return raw as AccentColor;
  }

  if (raw.includes("purple")) return "violet";
  if (raw.includes("green")) return "emerald";
  if (raw.includes("pink")) return "rose";

  if (
    raw.includes("gold") ||
    raw.includes("yellow") ||
    raw.includes("beige")
  ) {
    return "amber";
  }

  if (
    raw.includes("gray") ||
    raw.includes("grey") ||
    raw.includes("black") ||
    raw.includes("white")
  ) {
    return "neutral";
  }

  return "blue";
}

function normalizeSpacing(value: unknown): Spacing {
  const raw = text(value).toLowerCase();

  if (raw === "compact" || raw.includes("dense")) return "compact";

  if (
    raw === "spacious" ||
    raw.includes("airy") ||
    raw.includes("generous")
  ) {
    return "spacious";
  }

  return "normal";
}

function normalizeRadius(value: unknown): Radius {
  const raw = text(value).toLowerCase();

  if (raw === "none" || raw.includes("sharp")) return "none";
  if (raw === "small") return "small";
  if (raw === "large" || raw.includes("round")) return "large";

  return "medium";
}

function normalizeTypography(value: unknown): Typography {
  const raw = text(value).toLowerCase();

  if (raw === "editorial" || raw.includes("serif")) return "editorial";
  if (raw === "technical" || raw.includes("mono")) return "technical";
  if (raw === "bold") return "bold";

  return "clean";
}

function normalizeSectionType(value: unknown): SectionType {
  const raw = text(value).toLowerCase();

  const allowed: SectionType[] = [
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
  ];

  if (allowed.includes(raw as SectionType)) {
    return raw as SectionType;
  }

  if (
    raw.includes("gallery") ||
    raw.includes("portfolio") ||
    raw.includes("collection") ||
    raw.includes("products") ||
    raw.includes("menu") ||
    raw.includes("about")
  ) {
    return "showcase";
  }

  if (
    raw.includes("benefit") ||
    raw.includes("service") ||
    raw.includes("feature")
  ) {
    return "features";
  }

  if (raw.includes("review")) return "testimonials";
  if (raw.includes("plan")) return "pricing";
  if (raw.includes("question")) return "faq";

  return "showcase";
}

function normalizeVariant(
  value: unknown,
  sectionType: SectionType
): SectionVariant {
  const raw = text(value).toLowerCase();

  const allowed: SectionVariant[] = [
    "simple",
    "centered",
    "split",
    "cards",
    "grid",
    "editorial",
    "band",
    "minimal",
  ];

  if (allowed.includes(raw as SectionVariant)) {
    return raw as SectionVariant;
  }

  // AI može koristiti prirodne dizajnerske termine.
  // Mi ih prevodimo u vocabulary koji renderer razumije.

  if (
    raw.includes("gallery") ||
    raw.includes("masonry") ||
    raw.includes("tiles") ||
    raw.includes("columns")
  ) {
    return "grid";
  }

  if (
    raw.includes("two-column") ||
    raw.includes("two column") ||
    raw.includes("side-by-side")
  ) {
    return "split";
  }

  if (raw.includes("card")) return "cards";
  if (raw.includes("editor")) return "editorial";
  if (raw.includes("center")) return "centered";

  // Sensible fallback zavisno od vrste sekcije

  if (sectionType === "hero") return "split";

  if (
    sectionType === "features" ||
    sectionType === "pricing" ||
    sectionType === "testimonials"
  ) {
    return "cards";
  }

  if (sectionType === "stats") return "band";
  if (sectionType === "showcase") return "grid";

  return "simple";
}

function normalizeSurface(value: unknown): SectionSurface {
  const raw = text(value).toLowerCase();

  if (raw === "muted" || raw.includes("soft")) return "muted";
  if (raw === "accent" || raw.includes("highlight")) return "accent";
  if (raw === "inverse" || raw.includes("contrast")) return "inverse";

  return "base";
}

function normalizeAlignment(value: unknown): Alignment {
  return text(value).toLowerCase().includes("center")
    ? "center"
    : "left";
}

function normalizeVisual(value: unknown): VisualType {
  const raw = text(value).toLowerCase();

  const allowed: VisualType[] = [
    "none",
    "abstract",
    "product",
    "dashboard",
    "phone",
    "gallery",
    "cards",
  ];

  if (allowed.includes(raw as VisualType)) {
    return raw as VisualType;
  }

  if (
    raw.includes("photo") ||
    raw.includes("image") ||
    raw.includes("gallery")
  ) {
    return "gallery";
  }

  if (raw.includes("mobile") || raw.includes("app")) return "phone";

  if (
    raw.includes("analytics") ||
    raw.includes("chart") ||
    raw.includes("dashboard")
  ) {
    return "dashboard";
  }

  if (raw.includes("product") || raw.includes("mockup")) {
    return "product";
  }

  return "abstract";
}

function normalizeItem(value: unknown): WireframeItem {
  if (typeof value === "string") {
    return {
      title: value,
      description: "",
      meta: "",
    };
  }

  if (!isObject(value)) {
    return {
      title: "",
      description: "",
      meta: "",
    };
  }

  return {
    title: text(value.title),
    description: text(value.description),
    meta: text(value.meta),
  };
}

function normalizeSection(value: unknown): WireframeSection {
  const section = isObject(value) ? value : {};

  const type = normalizeSectionType(section.type);

  const items = Array.isArray(section.items)
    ? section.items.map(normalizeItem)
    : [];

  return {
    type,
    variant: normalizeVariant(section.variant, type),
    surface: normalizeSurface(section.surface),
    alignment: normalizeAlignment(section.alignment),
    visual: normalizeVisual(section.visual),

    eyebrow: text(section.eyebrow),
    heading: text(section.heading),
    body: text(section.body),

    primaryButton: text(section.primaryButton),
    secondaryButton: text(section.secondaryButton),

    items,
  };
}

function normalizeDesign(value: unknown): DesignSystem {
  const design = isObject(value) ? value : {};

  return {
    theme: normalizeTheme(design.theme),
    mood: normalizeMood(design.mood),
    accent: normalizeAccent(design.accent),
    spacing: normalizeSpacing(design.spacing),
    radius: normalizeRadius(design.radius),
    typography: normalizeTypography(design.typography),
  };
}

export function normalizeWireframe(value: unknown): Wireframe {
  const input = isObject(value) ? value : {};

  const sections = Array.isArray(input.sections)
    ? input.sections.map(normalizeSection)
    : [];

  return {
    title: text(input.title) || "Untitled Design",
    pageKind: normalizePageKind(input.pageKind),
    design: normalizeDesign(input.design),
    sections,
  };
}