"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(false);
  }

  return (
    <button onClick={handleClick} disabled={loading} className="btn-outline mt-3 gap-2 disabled:opacity-60">
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      Gerenciar faturamento
    </button>
  );
}
