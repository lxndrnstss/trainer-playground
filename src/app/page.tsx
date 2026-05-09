"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function normalize(text: string | null | undefined) {
  return (text || "").trim() || "—";
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

export default function Home() {
  const [query, setQuery] = useState("");
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

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "system-ui",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>
        Trainer Playground
      </h1>

      <p style={{ color: "#666", marginBottom: 24 }}>
        Discover trainers, mentors, facilitators, and ecosystem builders
        across Sarawak.
      </p>

      <div style={{ margin: "16px 0 32px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchTrainers(query);
          }}
          placeholder="Search by name, expertise, language, or location"
          style={{
            width: "100%",
            padding: 14,
            fontSize: 16,
            borderRadius: 10,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={() => fetchTrainers(query)}
          style={{
            marginTop: 12,
            padding: "12px 18px",
            fontSize: 16,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : trainers.length === 0 ? (
        <p>No trainers found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {trainers.map((t) => (
            <li
              key={t.id}
              style={{
                padding: 20,
                margin: "14px 0",
                borderRadius: 16,
                border: "1px solid #ddd",
                background: "#fff",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  marginBottom: 4,
                }}
              >
                {normalize(t.full_name || t.name)}
              </div>

              <div
                style={{
                  color: "#444",
                  marginBottom: 6,
                }}
              >
                {normalize(t.location || t.division || t.district)}
              </div>

              <div
                style={{
                  color: "#666",
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                {normalize(t.title || t.organization)}
              </div>

              <div
                style={{
                  color: "#555",
                  lineHeight: 1.6,
                }}
              >
                <strong>Languages:</strong>{" "}
                {normalize(t.languages)}
              </div>

              <div
                style={{
                  color: "#555",
                  marginTop: 6,
                  lineHeight: 1.6,
                }}
              >
                <strong>Expertise:</strong>{" "}
                {normalize(t.expertise)}
              </div>
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: "36px 0" }} />

      <a href="/submit">Submit a trainer</a>
    </main>
  );
}