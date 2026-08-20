"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface PhotoUploadProps {
  name: string;
  initialUrl?: string | null;
}

export function PhotoUpload({ name, initialUrl }: PhotoUploadProps) {
  const [url, setUrl] = useState<string | null>(initialUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Seleziona un file immagine.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("L'immagine deve essere sotto i 5MB.");
      return;
    }

    setError(null);
    setUploading(true);

    const supabase = createClient();
    const extension = file.name.split(".").pop() ?? "jpg";
    const path = `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("player-photos")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError("Caricamento non riuscito. Riprova.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("player-photos").getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-zinc-400">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : (
          <InitialsPlaceholder />
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <input type="hidden" name={name} value={url ?? ""} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-fit rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
        >
          {uploading ? "Caricamento…" : url ? "Cambia foto" : "Carica foto"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}

function InitialsPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975M15 7.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 4.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}
