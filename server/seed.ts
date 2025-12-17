import { db } from "./db";
import { markets, outcomes } from "@shared/schema";

const SEED_MARKETS = [
  {
    title: "Bitcoin to hit $100k by end of 2025?",
    description: "Prediction market on whether Bitcoin will reach $100,000 USD by December 31, 2025",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop",
    volume: "12500000",
    category: "Crypto",
    endDate: "Dec 31, 2025",
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
    endDate: "Jan 1, 2027",
    isFeatured: true,
    outcomes: [
      { label: "Yes", probability: "22.00", color: "bg-primary" },
      { label: "No", probability: "78.00", color: "bg-destructive" },
    ],
  },
  {
    title: "2028 US Presidential Election Winner",
    description: "Prediction market for the 2028 United States Presidential Election",
    image: "https://images.unsplash.com/photo-1541872703-74c5963631df?q=80&w=2070&auto=format&fit=crop",
    volume: "8100000",
    category: "Politics",
    endDate: "Nov 7, 2028",
    outcomes: [
      { label: "Democrat", probability: "48.00", color: "bg-blue-500" },
      { label: "Republican", probability: "45.00", color: "bg-red-500" },
      { label: "Other", probability: "7.00", color: "bg-yellow-500" },
    ],
  },
  {
    title: "Super Bowl LIX Winner",
    description: "Prediction market for Super Bowl LIX champion",
    image: "https://images.unsplash.com/photo-1611000273763-71887e504c5e?q=80&w=2070&auto=format&fit=crop",
    volume: "3200000",
    category: "Sports",
    endDate: "Feb 9, 2025",
    outcomes: [
      { label: "Chiefs", probability: "18.00", color: "bg-primary" },
      { label: "49ers", probability: "15.00", color: "bg-secondary" },
      { label: "Ravens", probability: "12.00", color: "bg-accent" },
    ],
  },
  {
    title: "Will SpaceX land on Mars by 2030?",
    description: "Market on SpaceX achieving a successful Mars landing",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop",
    volume: "18900000",
    category: "Tech",
    endDate: "Dec 31, 2030",
    outcomes: [
      { label: "Yes", probability: "42.00", color: "bg-primary" },
      { label: "No", probability: "58.00", color: "bg-destructive" },
    ],
  },
  {
    title: "Next James Bond Actor",
    description: "Prediction market for who will be cast as the next James Bond",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    volume: "1200000",
    category: "Pop Culture",
    endDate: "Dec 31, 2025",
    outcomes: [
      { label: "Aaron Taylor-Johnson", probability: "55.00", color: "bg-primary" },
      { label: "Henry Cavill", probability: "15.00", color: "bg-secondary" },
      { label: "Other", probability: "30.00", color: "bg-accent" },
    ],
  },
  {
    title: "Will GTA VI release in 2025?",
    description: "Market on Grand Theft Auto VI release date",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
    volume: "5600000",
    category: "Tech",
    endDate: "Dec 31, 2025",
    outcomes: [
      { label: "Yes", probability: "89.00", color: "bg-primary" },
      { label: "No", probability: "11.00", color: "bg-destructive" },
    ],
  },
  {
    title: "Ethereum Flippening (Market Cap > BTC) in 2025?",
    description: "Will Ethereum's market cap surpass Bitcoin's in 2025?",
    image: "https://images.unsplash.com/photo-1622790698141-94e30457ef12?q=80&w=2072&auto=format&fit=crop",
    volume: "9400000",
    category: "Crypto",
    endDate: "Dec 31, 2025",
    outcomes: [
      { label: "Yes", probability: "28.00", color: "bg-primary" },
      { label: "No", probability: "72.00", color: "bg-destructive" },
    ],
  },
];

async function seed() {
  console.log("Seeding database...");

  try {
    // Check if markets already exist
    const existingMarkets = await db.select().from(markets).limit(1);
    if (existingMarkets.length > 0) {
      console.log("Database already seeded. Skipping...");
      return;
    }

    for (const marketData of SEED_MARKETS) {
      const { outcomes: marketOutcomes, ...marketInfo } = marketData;
      
      // Insert market
      const [insertedMarket] = await db.insert(markets).values(marketInfo).returning();
      console.log(`Created market: ${insertedMarket.title}`);

      // Insert outcomes for this market
      await db.insert(outcomes).values(
        marketOutcomes.map(outcome => ({
          ...outcome,
          marketId: insertedMarket.id
        }))
      );
      console.log(`  - Added ${marketOutcomes.length} outcomes`);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seed();
