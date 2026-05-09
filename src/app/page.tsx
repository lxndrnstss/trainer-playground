"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function normalize(text: string | null | undefined) {
  return (text || "").trim() || "—";
}

function splitList(text: string | null | undefined) {
  return (text || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

type Trainer = {
  id: string;
  name: string | null;
  full_name?: string | null;
  location: string | null;
  division?: string | null;
  district?: string | null;
  title?: string | null;
  organization?: string | null;
  languages: string | null;
  expertise: string | null;
};

const archetypes = [
  "All",
  "Ecosystem Architect",
  "Frontier Builder",
  "Community Weaver",
  "Knowledge Keeper",
  "Capability Catalyst",
];

function inferArchetype(t: Trainer) {
  const text = `${t.expertise || ""} ${t.title || ""} ${t.organization || ""}`.toLowerCase();

  if (text.includes("ai") || text.includes("technology") || text.includes("digital")) {
    return "Frontier Builder";
  }

  if (text.includes("community") || text.includes("youth") || text.includes("rural")) {
    return "Community Weaver";
  }

  if (text.includes("culture") || text.includes("indigenous") || text.includes("heritage")) {
    return "Knowledge Keeper";
  }

  if (text.includes("business") || text.includes("entrepreneur") || text.includes("startup")) {
    return "Ecosystem Architect";
  }

  return "Capability Catalyst";
}

function archetypeStyle(archetype: string) {
  switch (archetype) {
    case "Frontier Builder":
      return {
        accent: "#67e8f9",
        glow: "rgba(103, 232, 249, 0.35)",
        gradient:
          "radial-gradient(circle at 20% 10%, rgba(103,232,249,0.28), transparent 32%), radial-gradient(circle at 85% 20%, rgba(99,102,241,0.28), transparent 30%)",
      };
    case "Community Weaver":
      return {
        accent: "#fb923c",
        glow: "rgba(251, 146, 60, 0.32)",
        gradient:
          "radial-gradient(circle at 15% 15%, rgba(251,146,60,0.28), transparent 32%), radial-gradient(circle at 80% 35%, rgba(244,114,182,0.18), transparent 28%)",
      };
    case "Knowledge Keeper":
      return {
        accent: "#86efac",
        glow: "rgba(134, 239, 172, 0.3)",
        gradient:
          "radial-gradient(circle at 20% 10%, rgba(34,197,94,0.24), transparent 32%), radial-gradient(circle at 80% 25%, rgba(120,113,108,0.25), transparent 30%)",
      };
    case "Ecosystem Architect":
      return {
        accent: "#facc15",
        glow: "rgba(250, 204, 21, 0.28)",
        gradient:
          "radial-gradient(circle at 20% 10%, rgba(250,204,21,0.24), transparent 32%), radial-gradient(circle at 80% 25%, rgba(148,163,184,0.18), transparent 30%)",
      };
    default:
      return {
        accent: "#c084fc",
        glow: "rgba(192, 132, 252, 0.3)",
        gradient:
          "radial-gradient(circle at 20% 10%, rgba(192,132,252,0.24), transparent 32%), radial-gradient(circle at 80% 25%, rgba(45,212,191,0.18), transparent 30%)",
      };
  }
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeArchetype, setActiveArchetype] = useState("All");
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  async function fetchTrainers(q: string) {
    setLoading(true);

    const trimmed = q.trim();

    if (!trimmed) {
      const { data } = await supabase
        .from("trainers_public")
        .select(`
          id,
          name,
          full_name,
          location,
          division,
          district,
          title,
          organization,
          languages,
          expertise
        `)
        .order("created_at", { ascending: false })
        .limit(25);

      setTrainers((data || []) as Trainer[]);
      setLoading(false);
      return;
    }

    const { data } = await supabase.rpc("search_trainers", {
      q: trimmed,
      limit_count: 25,
      offset_count: 0,
    });

    setTrainers((data || []) as Trainer[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchTrainers("");
  }, []);

  const filteredTrainers = useMemo(() => {
    if (activeArchetype === "All") return trainers;
    return trainers.filter((t) => inferArchetype(t) === activeArchetype);
  }, [trainers, activeArchetype]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(250,204,21,0.12), transparent 28%), radial-gradient(circle at top right, rgba(103,232,249,0.12), transparent 28%), #08090d",
        color: "#f8fafc",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        padding: "40px 20px",
      }}
    >
      <section style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ marginBottom: 38 }}>
          <div
            style={{
              display: "inline-flex",
              padding: "8px 12px",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 999,
              color: "#cbd5e1",
              fontSize: 13,
              marginBottom: 18,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(16px)",
            }}
          >
            Sarawak-first capability atlas
          </div>

          <h1
            style={{
              fontSize: "clamp(42px, 7vw, 84px)",
              lineHeight: 0.95,
              letterSpacing: "-0.07em",
              margin: "0 0 18px",
              maxWidth: 920,
            }}
          >
            Trainer Playground
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "clamp(17px, 2vw, 22px)",
              lineHeight: 1.55,
              maxWidth: 760,
              margin: 0,
            }}
          >
            Discover trainers, mentors, facilitators, TVET builders, community
            knowledge holders, and innovation leaders across Sarawak.
          </p>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 24,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            marginBottom: 26,
          }}
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchTrainers(query);
              }}
              placeholder="Search by name, expertise, language, or location"
              style={{
                flex: "1 1 320px",
                padding: "16px 18px",
                fontSize: 16,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(2,6,23,0.72)",
                color: "#f8fafc",
                outline: "none",
              }}
            />

            <button
              onClick={() => fetchTrainers(query)}
              style={{
                padding: "16px 22px",
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 16,
                border: "1px solid rgba(250,204,21,0.5)",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, rgba(250,204,21,0.95), rgba(251,146,60,0.95))",
                color: "#111827",
              }}
            >
              Search
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 16,
            }}
          >
            {archetypes.map((a) => (
              <button
                key={a}
                onClick={() => setActiveArchetype(a)}
                style={{
                  padding: "9px 13px",
                  borderRadius: 999,
                  border:
                    activeArchetype === a
                      ? "1px solid rgba(250,204,21,0.65)"
                      : "1px solid rgba(255,255,255,0.12)",
                  background:
                    activeArchetype === a
                      ? "rgba(250,204,21,0.16)"
                      : "rgba(255,255,255,0.04)",
                  color: activeArchetype === a ? "#fde68a" : "#cbd5e1",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p style={{ color: "#cbd5e1" }}>Loading capability cards…</p>
        ) : filteredTrainers.length === 0 ? (
          <p style={{ color: "#cbd5e1" }}>No trainers found.</p>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 22,
            }}
          >
            {filteredTrainers.map((t) => {
              const name = normalize(t.full_name || t.name);
              const location = normalize(t.location || t.division || t.district);
              const role = normalize(t.title || t.organization);
              const expertise = splitList(t.expertise);
              const languages = splitList(t.languages);
              const archetype = inferArchetype(t);
              const style = archetypeStyle(archetype);

              return (
                <article
  key={t.id}

  onMouseEnter={(e) => {
    e.currentTarget.style.transform =
      "translateY(-6px) scale(1.01)";
  }}

  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "translateY(0px) scale(1)";
  }}


                  style={{
                    position: "relative",
                    overflow: "hidden",
                    minHeight: 430,
                    padding: 20,
                    borderRadius: 28,
                    background:
                      `${style.gradient}, linear-gradient(145deg, rgba(15,23,42,0.96), rgba(2,6,23,0.98))`,
                    border: "1px solid rgba(255,255,255,0.14)",
                    boxShadow: `0 20px 60px rgba(0,0,0,0.35), 0 0 40px ${style.glow}`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.06) 28%, rgba(255,255,255,0.18) 38%, transparent 52%)",
                      opacity: 0.7,
                      pointerEvents: "none",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                      maskImage:
                        "radial-gradient(circle at top, black, transparent 72%)",
                      pointerEvents: "none",
                    }}
                  />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 22,
                      }}
                    >
                      <span
                        style={{
                          color: style.accent,
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                        }}
                      >
                        {archetype}
                      </span>

                      <span
                        style={{
                          color: "#cbd5e1",
                          fontSize: 11,
                          border: "1px solid rgba(255,255,255,0.14)",
                          borderRadius: 999,
                          padding: "5px 8px",
                          background: "rgba(255,255,255,0.05)",
                        }}
                      >
                        Recognized
                      </span>
                    </div>

                    <div
                      style={{
                        height: 128,
                        borderRadius: 24,
                        marginBottom: 18,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background:
                          "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 28%), rgba(255,255,255,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: style.accent,
                        fontSize: 46,
                        fontWeight: 900,
                        letterSpacing: "-0.08em",
                      }}
                    >
                      {name
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </div>

                    <h2
                      style={{
                        fontSize: 25,
                        lineHeight: 1.05,
                        letterSpacing: "-0.04em",
                        margin: "0 0 8px",
                      }}
                    >
                      {name}
                    </h2>

                    <p
                      style={{
                        color: "#cbd5e1",
                        margin: "0 0 4px",
                        fontSize: 14,
                      }}
                    >
                      {role}
                    </p>

                    <p
                      style={{
                        color: "#94a3b8",
                        margin: "0 0 18px",
                        fontSize: 14,
                      }}
                    >
                      {location}
                    </p>

                    <div style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          color: "#94a3b8",
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          marginBottom: 8,
                        }}
                      >
                        Capability Signature
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {(expertise.length ? expertise : ["Capability Builder"]).map(
                          (item) => (
                            <span
                              key={item}
                              style={{
                                fontSize: 12,
                                color: "#f8fafc",
                                padding: "7px 9px",
                                borderRadius: 999,
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.1)",
                              }}
                            >
                              {item}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          color: "#94a3b8",
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          marginBottom: 8,
                        }}
                      >
                        Languages
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {(languages.length ? languages : ["—"]).map((item) => (
                          <span
                            key={item}
                            style={{
                              fontSize: 12,
                              color: style.accent,
                              padding: "6px 8px",
                              borderRadius: 999,
                              background: "rgba(0,0,0,0.22)",
                              border: `1px solid ${style.accent}55`,
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <div
          style={{
            marginTop: 46,
            padding: 24,
            borderRadius: 24,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>
              Know a trainer, mentor, or community knowledge holder?
            </div>
            <div style={{ color: "#cbd5e1" }}>
              Help map Sarawak’s capability ecosystem.
            </div>
          </div>

          <a
            href="/submit"
            style={{
              color: "#111827",
              background: "#facc15",
              padding: "13px 16px",
              borderRadius: 14,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Submit a trainer
          </a>
        </div>
      </section>
    </main>
  );
}