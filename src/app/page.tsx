"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function normalize(text: string | null) {
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
        .select("id, name, location, languages, expertise")
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
    <main style={{ padding: "40px", fontFamily: "system-ui" }}>
      <h1>Trainer Playground</h1>

      <div style={{ margin: "16px 0" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchTrainers(query);
          }}
          placeholder="Search (name / location / languages / expertise)"
          style={{ width: "100%", padding: 10, fontSize: 16 }}
        />

        <button
          onClick={() => fetchTrainers(query)}
          style={{ marginTop: 12, padding: "10px 16px", fontSize: 16 }}
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
                padding: 14,
                margin: "12px 0",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            >
              <div style={{ fontWeight: 700 }}>{normalize(t.name)}</div>
              <div style={{ color: "#333" }}>{normalize(t.location)}</div>
              <div style={{ color: "#555" }}>
                {normalize(t.languages)} · {normalize(t.expertise)}
              </div>
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: "28px 0" }} />

      <a href="/submit">Submit a trainer</a>
    </main>
  );
}
