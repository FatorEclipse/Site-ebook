import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UpgradeButton from "@/components/UpgradeButton";
import ManageBillingButton from "@/components/ManageBillingButton";
import { Check } from "lucide-react";

const planDetails = {
  FREE: { label: "Gratuito", credits: 3, color: "text-ivory-300" },
  PRO: { label: "Pro", credits: 10, color: "text-gold-300" },
  BUSINESS: { label: "Business", credits: 9999, color: "text-gold-300" },
} as const;

export default async function AssinaturaPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: { subscription: true },
  });

  const plan = planDetails[user!.plan];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ivory-100">Assinatura</h1>
      <p className="mt-1 text-ivory-500">Gerencie seu plano e créditos de geração.</p>

      <div className="card mt-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-ivory-500">
              Plano atual
            </span>
            <p className={`font-display text-2xl font-semibold ${plan.color}`}>{plan.label}</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs uppercase tracking-widest text-ivory-500">
              Créditos restantes
            </span>
            <p className="font-display text-2xl font-semibold text-gold-300">{user!.credits}</p>
          </div>
        </div>

        {user!.subscription ? (
          <div className="mt-6">
            <p className="text-sm text-ivory-500">
              Status:{" "}
              <span className="text-ivory-300">{user!.subscription.status}</span>
              {user!.subscription.stripeCurrentPeriodEnd && (
                <>
                  {" "}
                  · Renova em{" "}
                  {user!.subscription.stripeCurrentPeriodEnd.toLocaleDateString("pt-BR")}
                </>
              )}
            </p>
            <ManageBillingButton />
          </div>
        ) : (
          <p className="mt-6 text-sm text-ivory-500">
            Você está no plano gratuito. Faça upgrade para gerar mais eBooks por mês.
          </p>
        )}
      </div>

      {user!.plan !== "BUSINESS" && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {user!.plan === "FREE" && (
            <PlanCard
              name="Pro"
              price="R$ 49/mês"
              features={["10 eBooks/mês", "Até 120 páginas", "Sem marca d'água", "PDF + DOCX"]}
              priceId={process.env.STRIPE_PRICE_PRO!}
            />
          )}
          <PlanCard
            name="Business"
            price="R$ 149/mês"
            features={["eBooks ilimitados", "PDF + DOCX + EPUB", "Página de vendas com IA", "Suporte prioritário"]}
            priceId={process.env.STRIPE_PRICE_BUSINESS!}
          />
        </div>
      )}
    </div>
  );
}

function PlanCard({
  name,
  price,
  features,
  priceId,
}: {
  name: string;
  price: string;
  features: string[];
  priceId: string;
}) {
  return (
    <div className="card p-6">
      <h3 className="font-display text-lg font-semibold text-ivory-100">{name}</h3>
      <p className="mt-1 font-display text-2xl text-gold-300">{price}</p>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-ivory-300">
            <Check className="h-4 w-4 text-gold-500" /> {f}
          </li>
        ))}
      </ul>
      <UpgradeButton priceId={priceId} planName={name} />
    </div>
  );
}
