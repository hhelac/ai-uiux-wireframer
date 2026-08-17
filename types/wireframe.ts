export type PageKind =
  | "landing"
  | "saas"
  | "ecommerce"
  | "portfolio"
  | "restaurant"
  | "booking"
  | "dashboard"
  | "service"
  | "other";

export type Theme = "light" | "dark";

export type Mood =
  | "minimal"
  | "modern"
  | "bold"
  | "luxury"
  | "playful"
  | "editorial"
  | "corporate"
  | "warm"
  | "technical";

export type AccentColor =
  | "cyan"
  | "blue"
  | "violet"
  | "emerald"
  | "rose"
  | "orange"
  | "amber"
  | "red"
  | "neutral";

export type Spacing = "compact" | "normal" | "spacious";

export type Radius = "none" | "small" | "medium" | "large";

export type Typography =
  | "clean"
  | "bold"
  | "editorial"
  | "technical";

export type SectionType =
  | "navbar"
  | "hero"
  | "features"
  | "stats"
  | "showcase"
  | "pricing"
  | "testimonials"
  | "faq"
  | "cta"
  | "contact"
  | "footer";

export type SectionVariant =
  | "simple"
  | "centered"
  | "split"
  | "cards"
  | "grid"
  | "editorial"
  | "band"
  | "minimal";

export type SectionSurface =
  | "base"
  | "muted"
  | "accent"
  | "inverse";

export type Alignment = "left" | "center";

export type VisualType =
  | "none"
  | "abstract"
  | "product"
  | "dashboard"
  | "phone"
  | "gallery"
  | "cards";

export interface WireframeItem {
  title: string;
  description: string;
  meta: string;
}

export interface DesignSystem {
  theme: Theme;
  mood: Mood;
  accent: AccentColor;
  spacing: Spacing;
  radius: Radius;
  typography: Typography;
}

export interface WireframeSection {
  type: SectionType;
  variant: SectionVariant;
  surface: SectionSurface;
  alignment: Alignment;
  visual: VisualType;

  eyebrow: string;
  heading: string;
  body: string;

  primaryButton: string;
  secondaryButton: string;

  items: WireframeItem[];
}

export interface Wireframe {
  title: string;
  pageKind: PageKind;
  design: DesignSystem;
  sections: WireframeSection[];
}