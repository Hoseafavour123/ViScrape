import { getCreditsPack, PackId } from '@/types/billing'
import { writeFile } from 'fs'
import 'server-only'
import Stripe from 'stripe'
import { prisma } from '../prisma'

export const HandleCheckoutSessionCompleted = async (
  event: Stripe.Checkout.Session
) => {
  const { userId, packId } = event.metadata as {
    userId: string
    packId: PackId
  }
  if (!userId || !packId) {
    throw new Error('Missing userId or packId in metadata')
  }

  const purchasedPack = getCreditsPack(packId)
  if (!purchasedPack) {
    throw new Error('Purchaes pack not found')
  }

  await prisma.userBalance.upsert({
    where: { userId },
    create: { userId, credits: purchasedPack.credits },
    update: { credits: { increment: purchasedPack.credits } },
  })

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!
    }
  })
}
