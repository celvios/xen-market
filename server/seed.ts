import { storage } from "./storage";
import { type InsertMarket, type InsertOutcome } from "@shared/schema";

const SEED_MARKETS = [
  {
    title: "Bitcoin to hit $100k by end of 2025?",
    description: "Prediction market on whether Bitcoin will reach $100,000 USD by December 31, 2025",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop",
    volume: "12500000",
    category: "Crypto",
    endDate: new Date("2026-01-01").toISOString(),
    isFeatured: true,
    outcomes: [
      { label: "Yes", probability: "65.00", color: "bg-primary" },
      { label: "No", probability: "35.00", color: "bg-destructive" },
    ],
  },
  {
    title: "Will AGI be achieved before 2027?",
    description: "Market predicting artificial general intelligence (AGI) achievement",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
    volume: "45200000",
    category: "Tech",
    endDate: new Date("2027-01-01").toISOString(),
    isFeatured: true,
    outcomes: [
      { label: "Yes", probability: "22.00", color: "bg-primary" },
      { label: "No", probability: "78.00", color: "bg-destructive" },
    ],
  },
  {
    title: "Ethereum Flippening (Market Cap > BTC) in 2025?",
    description: "Will Ethereum's market cap surpass Bitcoin's in 2025?",
    image: "https://images.unsplash.com/photo-1622790698141-94e30457ef12?q=80&w=2072&auto=format&fit=crop",
    volume: "9400000",
    category: "Crypto",
    endDate: new Date("2026-01-01").toISOString(),
    outcomes: [
      { label: "Yes", probability: "28.00", color: "bg-primary" },
      { label: "No", probability: "72.00", color: "bg-destructive" },
    ],
  },
];

export async function seedDatabase() {
  console.log("Seeding storage...");

  const existingMarkets = await storage.getAllMarkets();
  if (existingMarkets.length > 0) {
    console.log("Storage already seeded. Skipping...");
    return { message: "Already seeded" };
  }

  for (const marketData of SEED_MARKETS) {
    const { outcomes: marketOutcomes, ...marketInfo } = marketData;

    const market: InsertMarket = {
      ...marketInfo,
      description: marketInfo.description ?? null,
      isFeatured: marketInfo.isFeatured ?? false,
      isResolved: false
    };

    const outcomes: InsertOutcome[] = marketOutcomes.map(o => ({
      ...o,
      probability: o.probability.toString()
    }));

    const insertedMarket = await storage.createMarket(market, outcomes);
    console.log(`Created market: ${insertedMarket.title}`);
  }

  console.log("Storage seeded successfully!");
  return { message: "Seeded successfully" };
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
