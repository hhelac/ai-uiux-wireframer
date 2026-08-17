import { Wireframe } from "@/types/wireframe";

interface GeneratedWireframeProps {
  wireframe: Wireframe;
}

export default function GeneratedWireframe({
  wireframe,
}: GeneratedWireframeProps) {
  return (
    <div className="min-h-full bg-white text-black">
      {wireframe.sections.map((section, index) => {
        switch (section.type) {
          case "navbar":
            return (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-300 px-8 py-5"
              >
                <span className="text-xl font-bold">
                  {section.heading || wireframe.title}
                </span>

                <div className="flex gap-6 text-sm">
                  {section.items.map((item, itemIndex) => (
                    <span key={itemIndex}>{item}</span>
                  ))}
                </div>
              </div>
            );

          case "hero":
            return (
              <section
                key={index}
                className="flex min-h-[300px] flex-col items-center justify-center bg-gray-100 px-10 text-center"
              >
                <h1 className="mb-4 text-4xl font-bold">
                  {section.heading}
                </h1>

                <p className="mb-6 max-w-xl text-gray-600">
                  {section.body}
                </p>

                {section.buttonText && (
                  <button className="rounded-lg bg-black px-6 py-3 text-white">
                    {section.buttonText}
                  </button>
                )}
              </section>
            );

          case "features":
            return (
              <section key={index} className="px-8 py-10">
                <h2 className="mb-8 text-center text-2xl font-bold">
                  {section.heading}
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="rounded-lg border border-gray-300 p-5 text-center"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            );

          case "pricing":
            return (
              <section key={index} className="bg-gray-100 px-8 py-10">
                <h2 className="mb-8 text-center text-2xl font-bold">
                  {section.heading}
                </h2>

                <div className="flex justify-center gap-4">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="min-w-[150px] rounded-lg border border-gray-300 bg-white p-6 text-center"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            );

          case "testimonials":
            return (
              <section key={index} className="px-8 py-10">
                <h2 className="mb-6 text-center text-2xl font-bold">
                  {section.heading}
                </h2>

                <div className="flex gap-4">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex-1 rounded-lg bg-gray-100 p-5"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            );

          case "cta":
            return (
              <section
                key={index}
                className="flex flex-col items-center bg-gray-200 px-8 py-10 text-center"
              >
                <h2 className="mb-3 text-2xl font-bold">
                  {section.heading}
                </h2>

                <p className="mb-5 text-gray-600">
                  {section.body}
                </p>

                {section.buttonText && (
                  <button className="rounded-lg bg-black px-6 py-3 text-white">
                    {section.buttonText}
                  </button>
                )}
              </section>
            );

          case "footer":
            return (
              <footer
                key={index}
                className="bg-black px-8 py-8 text-center text-white"
              >
                <h3 className="font-bold">{section.heading}</h3>
                <p className="mt-2 text-sm text-gray-400">
                  {section.body}
                </p>
              </footer>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}