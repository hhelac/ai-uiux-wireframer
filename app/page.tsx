"use client";

import { useState } from "react";
import GeneratedWireframe from "@/components/GeneratedWireframe";
import { Wireframe } from "@/types/wireframe";

export default function Home() {
  const [showEditBox, setShowEditBox] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [editPrompt, setEditPrompt] = useState("");

  const [wireframe, setWireframe] = useState<Wireframe | null>(null);

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");

  async function generateWireframe() {
    if (!prompt.trim()) {
      setError("Please describe your design first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed.");
      }

      setWireframe(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function editWireframe() {
    if (!wireframe) {
      setError("Generate a design first.");
      return;
    }

    if (!editPrompt.trim()) {
      setError("Describe what you want to change.");
      return;
    }

    setEditing(true);
    setError("");

    try {
      const response = await fetch("/api/edit", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          wireframe: wireframe,
          editPrompt: editPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Editing failed.");
      }

      setWireframe(data);
      setEditPrompt("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setEditing(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-[#55DDE8]">
      <nav className="flex h-20 items-center px-5">
        <div className="flex w-1/4 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#55DDE8] text-2xl text-black">
            ⚙
          </div>

          <h1 className="text-3xl font-bold">DesAIgn</h1>
        </div>

        <div className="flex flex-1 items-center justify-around font-mono font-bold">
          <button>Workspace</button>
          <button>My projects</button>
          <button>My account</button>
        </div>
      </nav>

      <section className="flex gap-7 px-5 py-7">
        <aside className="w-[365px] shrink-0">
          <div className="flex h-[525px] flex-col rounded-[30px] border border-[#55DDE8] p-5">
            <h2 className="mb-5 text-center font-mono text-3xl font-bold leading-tight">
              DESCRIBE YOUR
              <br />
              IDEA DESIGN!
            </h2>

            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="h-[300px] w-full resize-none rounded-[28px] bg-[#353535] p-5 text-lg text-white outline-none"
              placeholder="Describe your idea..."
            />

            {error && (
              <p className="mt-2 text-center text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="mt-auto flex justify-center">
              <button
                onClick={generateWireframe}
                disabled={loading}
                className="rounded-full bg-[#55DDE8] px-12 py-4 font-mono font-bold text-black disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="h-[530px] overflow-y-auto bg-[#222]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-xl text-gray-500">
                Generating your design...
              </div>
            ) : wireframe ? (
              <GeneratedWireframe wireframe={wireframe} />
            ) : (
              <div className="flex h-full items-center justify-center text-xl text-gray-500">
                Your generated design will appear here
              </div>
            )}
          </div>

          {showEditBox && (
            <div className="flex gap-3">
              <input
                type="text"
                value={editPrompt}
                onChange={(event) => setEditPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    editWireframe();
                  }
                }}
                placeholder="Describe what you want to change..."
                className="flex-1 rounded-full border border-[#55DDE8] bg-[#222] px-6 py-4 text-white outline-none"
              />

              <button
                onClick={editWireframe}
                disabled={editing}
                className="rounded-full bg-[#55DDE8] px-8 font-mono font-bold text-black disabled:opacity-50"
              >
                {editing ? "Applying..." : "Apply"}
              </button>
            </div>
          )}
        </div>

        <aside className="flex w-[165px] shrink-0 flex-col gap-2">
          <button
            onClick={() => setShowEditBox(!showEditBox)}
            disabled={!wireframe}
            className="rounded-full bg-[#55DDE8] px-4 py-4 font-mono font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Edit design
          </button>

          <button
            disabled={!wireframe}
            className="rounded-full bg-[#55DDE8] px-4 py-4 font-mono font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save
          </button>

          <button
            disabled={!wireframe}
            className="rounded-full bg-[#55DDE8] px-4 py-4 font-mono font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Download
          </button>
        </aside>
      </section>
    </main>
  );
}