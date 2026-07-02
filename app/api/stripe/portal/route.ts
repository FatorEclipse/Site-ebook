import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  if (!subscription) {
    return NextResponse.json({ error: "Nenhuma assinatura ativa." }, { status: 404 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard/assinatura`,
  });

  return NextResponse.json({ url: portal.url });
}
