"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function UpgradeButton({ priceId, planName }: { priceId: string; planName: string }) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(false);
  }

  return (
    <button onClick={handleUpgrade} disabled={loading} className="btn-gold mt-6 w-full gap-2 disabled:opacity-60">
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      Assinar {planName}
    </button>
  );
}
