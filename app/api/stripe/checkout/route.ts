import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { priceId } = await req.json();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  // Reaproveita o customer existente no Stripe ou cria um novo
  const customerId =
    user!.subscription?.stripeCustomerId ??
    (await stripe.customers.create({ email: user!.email, name: user!.name ?? undefined })).id;

  const checkout = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard/assinatura?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/assinatura?canceled=true`,
    metadata: { userId: user!.id },
  });

  return NextResponse.json({ url: checkout.url });
}
