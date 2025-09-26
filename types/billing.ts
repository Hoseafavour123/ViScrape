export enum PackId {
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE',
}

export type CreditsPack ={
    id: PackId;
    name: string;
    credits: number;
    price: number; // in cents
    label: string;
    priceId: string
}

export const CreditsPacks: CreditsPack[] = [
  {
    id: PackId.SMALL,
    name: 'Small Pack',
    credits: 1000,
    price: 999,
    label: '1,000 Credits',
    priceId: process.env.STRIPE_SMALL_PACK_PRICE_ID!
  },
  {
    id: PackId.MEDIUM,
    name: 'Medium Pack',
    credits: 5000,
    price: 3999,
    label: '5,000 Credits',
    priceId: process.env.STRIPE_MEDIUM_PACK_PRICE_ID!
  },
  {
    id: PackId.LARGE,
    name: 'Large Pack',
    credits: 10000,
    price: 6999,
    label: '10,000 Credits',
    priceId: process.env.STRIPE_LARGE_PACK_PRICE_ID!
  },
]


export const getCreditsPack = (id: PackId) => {
    return CreditsPacks.find(pack => pack.id === id)
}