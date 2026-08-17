export type SectionType =
  | "navbar"
  | "hero"
  | "features"
  | "pricing"
  | "testimonials"
  | "cta"
  | "footer";

export interface WireframeSection {
  type: SectionType;
  heading: string;
  body: string;
  buttonText: string;
  items: string[];
}

export interface Wireframe {
  title: string;
  sections: WireframeSection[];
}