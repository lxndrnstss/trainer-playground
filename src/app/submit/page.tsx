"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SubmitTrainer() {
  const [status, setStatus] = useState<null | string>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: (formData.get("name") as string)?.trim() || null,
      location: (formData.get("location") as string)?.trim() || null,
      languages: (formData.get("languages") as string)?.trim() || null,
      expertise: (formData.get("expertise") as string)?.trim() || null,
      ethnicity: (formData.get("ethnicity") as string)?.trim() || null,
      bio: (formData.get("bio") as string)?.trim() || null,
      email: (formData.get("email") as string)?.trim() || null,
      phone: (formData.get("phone") as string)?.trim() || null,
    };

    const { error } = await supabase
      .from("trainer_submissions")
      .insert(payload);

    if (error) {
      setStatus("Failed. Try again later.");
    } else {
      setStatus("Submitted! Thanks — pending approval.");
      form.reset();
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 720 }}>
      <h1>Submit a Sarawak trainer</h1>
      <p>
        Submissions are reviewed before being added to the public search.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 12, marginTop: 16 }}
      >
        <input name="name" placeholder="Trainer name" required />
        <input name="location" placeholder="City/Town" required />
        <input name="languages" placeholder="Languages" required />
        <input name="expertise" placeholder="Expertise" required />

        <input name="ethnicity" placeholder="Ethnicity (optional)" />
        <textarea
          name="bio"
          placeholder="Short bio (optional)"
          rows={4}
        />

        <input name="email" placeholder="Email (optional)" />
        <input name="phone" placeholder="Phone (optional)" />

        <button type="submit" style={{ padding: "10px 16px", fontSize: 16 }}>
          Submit
        </button>
      </form>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}

      <hr style={{ margin: "28px 0" }} />
      <a href="/">Back to search</a>
    </main>
  );
}
