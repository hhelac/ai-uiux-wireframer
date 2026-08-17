import {
  AccentColor,
  DesignSystem,
  VisualType,
  Wireframe,
  WireframeSection,
} from "@/types/wireframe";

interface GeneratedWireframeProps {
  wireframe: Wireframe;
}

const accentStyles: Record<
  AccentColor,
  {
    solid: string;
    soft: string;
    text: string;
    border: string;
    buttonText: string;
  }
> = {
  cyan: {
    solid: "bg-cyan-400",
    soft: "bg-cyan-400/10",
    text: "text-cyan-400",
    border: "border-cyan-400/30",
    buttonText: "text-slate-950",
  },

  blue: {
    solid: "bg-blue-600",
    soft: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/30",
    buttonText: "text-white",
  },

  violet: {
    solid: "bg-violet-600",
    soft: "bg-violet-500/10",
    text: "text-violet-500",
    border: "border-violet-500/30",
    buttonText: "text-white",
  },

  emerald: {
    solid: "bg-emerald-500",
    soft: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/30",
    buttonText: "text-white",
  },

  rose: {
    solid: "bg-rose-500",
    soft: "bg-rose-500/10",
    text: "text-rose-500",
    border: "border-rose-500/30",
    buttonText: "text-white",
  },

  orange: {
    solid: "bg-orange-500",
    soft: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/30",
    buttonText: "text-white",
  },

  amber: {
    solid: "bg-amber-400",
    soft: "bg-amber-400/10",
    text: "text-amber-500",
    border: "border-amber-400/30",
    buttonText: "text-slate-950",
  },

  red: {
    solid: "bg-red-600",
    soft: "bg-red-500/10",
    text: "text-red-500",
    border: "border-red-500/30",
    buttonText: "text-white",
  },

  neutral: {
    solid: "bg-slate-800",
    soft: "bg-slate-500/10",
    text: "text-slate-500",
    border: "border-slate-400/30",
    buttonText: "text-white",
  },
};

function radiusClass(design: DesignSystem) {
  switch (design.radius) {
    case "none":
      return "rounded-none";

    case "small":
      return "rounded-md";

    case "large":
      return "rounded-3xl";

    default:
      return "rounded-xl";
  }
}

function spacingClass(design: DesignSystem) {
  switch (design.spacing) {
    case "compact":
      return "py-8";

    case "spacious":
      return "py-16";

    default:
      return "py-12";
  }
}

function typographyClass(design: DesignSystem) {
  switch (design.typography) {
    case "editorial":
      return "font-serif";

    case "technical":
      return "font-mono";

    default:
      return "font-sans";
  }
}

function sectionSurface(
  section: WireframeSection,
  design: DesignSystem
) {
  const accent = accentStyles[design.accent];
  const dark = design.theme === "dark";

  if (section.surface === "muted") {
    return dark
      ? "bg-white/[0.04]"
      : "bg-black/[0.035]";
  }

  if (section.surface === "accent") {
    return accent.soft;
  }

  if (section.surface === "inverse") {
    return dark
      ? "bg-white text-slate-950"
      : "bg-slate-950 text-white";
  }

  return "bg-transparent";
}

function PrimaryButton({
  text,
  design,
}: {
  text: string;
  design: DesignSystem;
}) {
  if (!text) {
    return null;
  }

  const accent = accentStyles[design.accent];

  return (
    <button
      className={`${accent.solid} ${accent.buttonText} ${radiusClass(
        design
      )} px-6 py-3 text-sm font-semibold shadow-sm transition hover:opacity-90`}
    >
      {text}
    </button>
  );
}

function SecondaryButton({
  text,
  design,
}: {
  text: string;
  design: DesignSystem;
}) {
  if (!text) {
    return null;
  }

  return (
    <button
      className={`${radiusClass(
        design
      )} border border-current/20 px-6 py-3 text-sm font-semibold transition hover:bg-current/5`}
    >
      {text}
    </button>
  );
}

function SectionHeading({
  section,
  design,
}: {
  section: WireframeSection;
  design: DesignSystem;
}) {
  const accent = accentStyles[design.accent];

  return (
    <div
      className={
        section.alignment === "center"
          ? "mx-auto mb-8 max-w-2xl text-center"
          : "mb-8 max-w-2xl"
      }
    >
      {section.eyebrow && (
        <p
          className={`mb-3 text-xs font-bold uppercase tracking-[0.22em] ${accent.text}`}
        >
          {section.eyebrow}
        </p>
      )}

      {section.heading && (
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {section.heading}
        </h2>
      )}

      {section.body && (
        <p className="mt-4 leading-7 opacity-65">
          {section.body}
        </p>
      )}
    </div>
  );
}

function DesignVisual({
  type,
  design,
}: {
  type: VisualType;
  design: DesignSystem;
}) {
  const accent = accentStyles[design.accent];
  const radius = radiusClass(design);

  if (type === "phone") {
    return (
      <div className="flex min-h-[290px] items-center justify-center">
        <div
          className={`${radius} w-[155px] border-[5px] border-current/15 bg-current/[0.04] p-2 shadow-2xl`}
        >
          <div className="mb-4 mx-auto h-2 w-12 rounded-full bg-current/15" />

          <div className={`${accent.soft} rounded-xl p-4`}>
            <div className={`mb-3 h-16 ${accent.solid} rounded-lg opacity-80`} />
            <div className="mb-2 h-2 w-4/5 rounded bg-current/15" />
            <div className="mb-5 h-2 w-3/5 rounded bg-current/10" />

            <div className="grid grid-cols-2 gap-2">
              <div className="h-12 rounded-lg bg-current/10" />
              <div className="h-12 rounded-lg bg-current/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div
        className={`${radius} min-h-[270px] border border-current/10 bg-current/[0.035] p-5 shadow-xl`}
      >
        <div className="mb-5 flex gap-2">
          <div className="h-2 w-2 rounded-full bg-current/20" />
          <div className="h-2 w-2 rounded-full bg-current/20" />
          <div className="h-2 w-2 rounded-full bg-current/20" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className={`${accent.soft} col-span-2 h-24 rounded-xl`} />
          <div className="h-24 rounded-xl bg-current/[0.06]" />

          <div className="h-28 rounded-xl bg-current/[0.06]" />

          <div className={`${accent.soft} col-span-2 h-28 rounded-xl`}>
            <div className="flex h-full items-end gap-2 p-4">
              {[35, 60, 45, 80, 55, 90].map((height, index) => (
                <div
                  key={index}
                  className={`${accent.solid} flex-1 rounded-t-sm opacity-75`}
                  style={{
                    height: `${height}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "gallery") {
    return (
      <div className="grid min-h-[280px] grid-cols-2 gap-3">
        <div
          className={`${radius} ${accent.soft} row-span-2`}
        />

        <div
          className={`${radius} bg-current/[0.07]`}
        />

        <div
          className={`${radius} ${accent.soft}`}
        />
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="relative min-h-[280px]">
        <div
          className={`${radius} absolute left-8 top-6 h-48 w-[70%] rotate-[-6deg] bg-current/[0.06] shadow-lg`}
        />

        <div
          className={`${radius} ${accent.soft} absolute right-5 top-16 h-48 w-[70%] rotate-[5deg] border ${accent.border} shadow-xl`}
        />

        <div
          className={`${radius} absolute bottom-2 left-[18%] h-48 w-[70%] border border-current/10 bg-current/[0.035] shadow-xl`}
        />
      </div>
    );
  }

  if (type === "product") {
    return (
      <div
        className={`${radius} ${accent.soft} relative flex min-h-[290px] items-center justify-center overflow-hidden border ${accent.border}`}
      >
        <div
          className={`${accent.solid} absolute h-52 w-52 rounded-full opacity-20 blur-3xl`}
        />

        <div
          className={`${radius} relative h-44 w-36 rotate-[8deg] border border-current/20 bg-current/[0.08] shadow-2xl`}
        />

        <div
          className={`${radius} absolute h-44 w-36 translate-x-[-45px] rotate-[-8deg] border border-current/10 bg-current/[0.05] shadow-xl`}
        />
      </div>
    );
  }

  return (
    <div
      className={`${radius} ${accent.soft} relative min-h-[280px] overflow-hidden border ${accent.border}`}
    >
      <div
        className={`${accent.solid} absolute -right-12 -top-12 h-52 w-52 rounded-full opacity-20 blur-2xl`}
      />

      <div
        className={`${accent.solid} absolute -bottom-20 left-12 h-60 w-60 rounded-full opacity-10 blur-3xl`}
      />

      <div className="absolute inset-8 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-current/10 bg-current/[0.04]" />

        <div className="grid gap-3">
          <div className="rounded-xl border border-current/10 bg-current/[0.06]" />
          <div className="rounded-xl border border-current/10 bg-current/[0.03]" />
        </div>
      </div>
    </div>
  );
}

export default function GeneratedWireframe({
  wireframe,
}: GeneratedWireframeProps) {
  const design = wireframe.design;
  const accent = accentStyles[design.accent];

  const dark = design.theme === "dark";

  const pageBackground = dark
    ? "bg-[#0b0d10] text-[#f5f7fa]"
    : "bg-[#f8f8f6] text-[#151719]";

  const cardBackground = dark
    ? "bg-white/[0.045]"
    : "bg-white";

  const cardBorder = dark
    ? "border-white/10"
    : "border-black/10";

  const radius = radiusClass(design);
  const spacing = spacingClass(design);
  const typography = typographyClass(design);

  return (
    <div
      className={`${pageBackground} ${typography} min-h-full overflow-hidden`}
    >
      {wireframe.sections.map((section, index) => {
        const surface = sectionSurface(section, design);

        if (section.type === "navbar") {
          return (
            <nav
              key={index}
              className={`${surface} border-b ${cardBorder}`}
            >
              <div className="mx-auto flex max-w-6xl items-center justify-between px-7 py-5">
                <span className="text-lg font-bold tracking-tight">
                  {section.heading || wireframe.title}
                </span>

                <div className="hidden items-center gap-6 text-sm opacity-70 md:flex">
                  {section.items.map((item, itemIndex) => (
                    <span key={itemIndex}>{item.title}</span>
                  ))}
                </div>

                {section.primaryButton && (
                  <PrimaryButton
                    text={section.primaryButton}
                    design={design}
                  />
                )}
              </div>
            </nav>
          );
        }

        if (section.type === "hero") {
          const split = section.variant === "split";

          return (
            <section
              key={index}
              className={`${surface} ${spacing}`}
            >
              <div
                className={`mx-auto max-w-6xl px-7 ${
                  split
                    ? "grid items-center gap-10 md:grid-cols-2"
                    : ""
                }`}
              >
                <div
                  className={
                    split
                      ? ""
                      : "mx-auto max-w-3xl text-center"
                  }
                >
                  {section.eyebrow && (
                    <div
                      className={`mb-5 inline-flex ${radius} ${accent.soft} ${accent.text} px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]`}
                    >
                      {section.eyebrow}
                    </div>
                  )}

                  <h1
                    className={`font-semibold tracking-[-0.04em] ${
                      design.mood === "bold"
                        ? "text-5xl md:text-7xl"
                        : "text-4xl md:text-6xl"
                    }`}
                  >
                    {section.heading}
                  </h1>

                  <p className="mt-6 max-w-2xl text-base leading-7 opacity-65 md:text-lg">
                    {section.body}
                  </p>

                  <div
                    className={`mt-8 flex flex-wrap gap-3 ${
                      split ? "" : "justify-center"
                    }`}
                  >
                    <PrimaryButton
                      text={section.primaryButton}
                      design={design}
                    />

                    <SecondaryButton
                      text={section.secondaryButton}
                      design={design}
                    />
                  </div>
                </div>

                {split && section.visual !== "none" && (
                  <DesignVisual
                    type={section.visual}
                    design={design}
                  />
                )}

                {!split && section.visual !== "none" && (
                  <div className="mx-auto mt-12 max-w-3xl">
                    <DesignVisual
                      type={section.visual}
                      design={design}
                    />
                  </div>
                )}
              </div>
            </section>
          );
        }

        if (section.type === "features") {
          return (
            <section
              key={index}
              className={`${surface} ${spacing}`}
            >
              <div className="mx-auto max-w-6xl px-7">
                <SectionHeading
                  section={section}
                  design={design}
                />

                <div className="grid gap-4 md:grid-cols-3">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`${cardBackground} ${cardBorder} ${radius} border p-6 shadow-sm`}
                    >
                      <div
                        className={`${accent.soft} ${accent.text} mb-5 flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold`}
                      >
                        {String(itemIndex + 1).padStart(2, "0")}
                      </div>

                      <h3 className="text-lg font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 opacity-60">
                        {item.description}
                      </p>

                      {item.meta && (
                        <p
                          className={`mt-4 text-xs font-semibold ${accent.text}`}
                        >
                          {item.meta}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === "stats") {
          return (
            <section
              key={index}
              className={`${surface} ${spacing}`}
            >
              <div className="mx-auto max-w-6xl px-7">
                <div
                  className={`${cardBackground} ${cardBorder} ${radius} grid border md:grid-cols-4`}
                >
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="border-b border-current/10 p-7 text-center last:border-0 md:border-b-0 md:border-r"
                    >
                      <div className={`text-3xl font-bold ${accent.text}`}>
                        {item.title}
                      </div>

                      <p className="mt-2 text-sm opacity-60">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === "showcase") {
          return (
            <section
              key={index}
              className={`${surface} ${spacing}`}
            >
              <div className="mx-auto grid max-w-6xl items-center gap-10 px-7 md:grid-cols-2">
                <div>
                  <SectionHeading
                    section={section}
                    design={design}
                  />

                  <div className="space-y-4">
                    {section.items.slice(0, 3).map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-4">
                        <div
                          className={`${accent.solid} mt-2 h-2 w-2 shrink-0 rounded-full`}
                        />

                        <div>
                          <h3 className="font-semibold">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-sm leading-6 opacity-60">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7">
                    <PrimaryButton
                      text={section.primaryButton}
                      design={design}
                    />
                  </div>
                </div>

                <DesignVisual
                  type={
                    section.visual === "none"
                      ? "abstract"
                      : section.visual
                  }
                  design={design}
                />
              </div>
            </section>
          );
        }

        if (section.type === "pricing") {
          return (
            <section
              key={index}
              className={`${surface} ${spacing}`}
            >
              <div className="mx-auto max-w-6xl px-7">
                <SectionHeading
                  section={section}
                  design={design}
                />

                <div className="grid gap-4 md:grid-cols-3">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`${cardBackground} ${cardBorder} ${radius} border p-7 shadow-sm ${
                        itemIndex === 1
                          ? `${accent.border} ring-1`
                          : ""
                      }`}
                    >
                      <h3 className="text-lg font-semibold">
                        {item.title}
                      </h3>

                      {item.meta && (
                        <div className="my-5 text-3xl font-bold">
                          {item.meta}
                        </div>
                      )}

                      <p className="min-h-[60px] text-sm leading-6 opacity-60">
                        {item.description}
                      </p>

                      <div className="mt-6">
                        <PrimaryButton
                          text={
                            section.primaryButton || "Choose plan"
                          }
                          design={design}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === "testimonials") {
          return (
            <section
              key={index}
              className={`${surface} ${spacing}`}
            >
              <div className="mx-auto max-w-6xl px-7">
                <SectionHeading
                  section={section}
                  design={design}
                />

                <div className="grid gap-4 md:grid-cols-3">
                  {section.items.map((item, itemIndex) => (
                    <article
                      key={itemIndex}
                      className={`${cardBackground} ${cardBorder} ${radius} border p-6`}
                    >
                      <p className="text-sm leading-7 opacity-75">
                        “{item.description}”
                      </p>

                      <div className="mt-6">
                        <div className="font-semibold">
                          {item.title}
                        </div>

                        <div className="mt-1 text-xs opacity-50">
                          {item.meta}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === "faq") {
          return (
            <section
              key={index}
              className={`${surface} ${spacing}`}
            >
              <div className="mx-auto max-w-3xl px-7">
                <SectionHeading
                  section={section}
                  design={design}
                />

                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`${cardBackground} ${cardBorder} ${radius} border p-5`}
                    >
                      <h3 className="font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 opacity-60">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === "cta") {
          return (
            <section className={`${spacing} px-7`} key={index}>
              <div
                className={`${accent.solid} ${accent.buttonText} ${radius} mx-auto max-w-6xl overflow-hidden px-8 py-12 text-center`}
              >
                {section.eyebrow && (
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
                    {section.eyebrow}
                  </p>
                )}

                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {section.heading}
                </h2>

                <p className="mx-auto mt-4 max-w-xl opacity-70">
                  {section.body}
                </p>

                {section.primaryButton && (
                  <button
                    className={`${radius} mt-7 bg-black px-6 py-3 text-sm font-semibold text-white`}
                  >
                    {section.primaryButton}
                  </button>
                )}
              </div>
            </section>
          );
        }

        if (section.type === "contact") {
          return (
            <section
              key={index}
              className={`${surface} ${spacing}`}
            >
              <div className="mx-auto grid max-w-6xl gap-10 px-7 md:grid-cols-2">
                <div>
                  <SectionHeading
                    section={section}
                    design={design}
                  />

                  <div className="space-y-4 text-sm">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <div className="font-semibold">
                          {item.title}
                        </div>

                        <div className="mt-1 opacity-55">
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`${cardBackground} ${cardBorder} ${radius} border p-6`}
                >
                  <div
                    className={`${radius} mb-3 h-11 border ${cardBorder} bg-current/[0.025]`}
                  />

                  <div
                    className={`${radius} mb-3 h-11 border ${cardBorder} bg-current/[0.025]`}
                  />

                  <div
                    className={`${radius} mb-4 h-28 border ${cardBorder} bg-current/[0.025]`}
                  />

                  <PrimaryButton
                    text={section.primaryButton || "Send"}
                    design={design}
                  />
                </div>
              </div>
            </section>
          );
        }

        if (section.type === "footer") {
          return (
            <footer
              key={index}
              className={`${
                dark ? "bg-black/30" : "bg-black/[0.04]"
              } border-t ${cardBorder}`}
            >
              <div className="mx-auto flex max-w-6xl flex-col gap-5 px-7 py-9 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-bold">
                    {section.heading || wireframe.title}
                  </div>

                  <div className="mt-1 text-xs opacity-45">
                    {section.body}
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 text-xs opacity-60">
                  {section.items.map((item, itemIndex) => (
                    <span key={itemIndex}>{item.title}</span>
                  ))}
                </div>
              </div>
            </footer>
          );
        }

        return null;
      })}
    </div>
  );
}