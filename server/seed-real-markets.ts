import { storage } from "./storage";

export async function seedRealMarkets() {
  console.log("Seeding real markets...");

  const markets = [
    // CRYPTO (5 markets)
    {
      title: "Will Bitcoin reach $150,000 by end of 2025?",
      description: "Bitcoin price prediction for end of year 2025",
      category: "Crypto",
      endDate: "Dec 31, 2025",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800",
      outcomes: [
        { label: "Yes", probability: "45.00", color: "#10b981" },
        { label: "No", probability: "55.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will Ethereum surpass $10,000 in 2025?",
      description: "Ethereum price prediction for 2025",
      category: "Crypto",
      endDate: "Dec 31, 2025",
      image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800",
      outcomes: [
        { label: "Yes", probability: "38.00", color: "#10b981" },
        { label: "No", probability: "62.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will Solana reach $500 by mid-2025?",
      description: "Solana price prediction for mid 2025",
      category: "Crypto",
      endDate: "Jun 30, 2025",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
      outcomes: [
        { label: "Yes", probability: "42.00", color: "#10b981" },
        { label: "No", probability: "58.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will a Bitcoin ETF reach $100B AUM in 2025?",
      description: "Bitcoin ETF assets under management prediction",
      category: "Crypto",
      endDate: "Dec 31, 2025",
      image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800",
      outcomes: [
        { label: "Yes", probability: "52.00", color: "#10b981" },
        { label: "No", probability: "48.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will XRP win SEC lawsuit by Q2 2025?",
      description: "Ripple vs SEC case resolution prediction",
      category: "Crypto",
      endDate: "Jun 30, 2025",
      image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800",
      outcomes: [
        { label: "Yes", probability: "65.00", color: "#10b981" },
        { label: "No", probability: "35.00", color: "#ef4444" }
      ]
    },

    // POLITICS (5 markets)
    {
      title: "Will Trump win 2024 US Presidential Election?",
      description: "2024 US Presidential Election outcome",
      category: "Politics",
      endDate: "Nov 5, 2024",
      image: "https://images.unsplash.com/photo-1586027021304-64a3833a9833?w=800",
      outcomes: [
        { label: "Yes", probability: "48.00", color: "#ef4444" },
        { label: "No", probability: "52.00", color: "#3b82f6" }
      ]
    },
    {
      title: "Will UK hold general election in 2025?",
      description: "UK general election timing prediction",
      category: "Politics",
      endDate: "Dec 31, 2025",
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800",
      outcomes: [
        { label: "Yes", probability: "72.00", color: "#10b981" },
        { label: "No", probability: "28.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will Biden run for re-election in 2024?",
      description: "Biden 2024 candidacy prediction",
      category: "Politics",
      endDate: "Aug 1, 2024",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
      outcomes: [
        { label: "Yes", probability: "85.00", color: "#10b981" },
        { label: "No", probability: "15.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will EU add new member state by 2026?",
      description: "EU expansion prediction",
      category: "Politics",
      endDate: "Dec 31, 2026",
      image: "https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=800",
      outcomes: [
        { label: "Yes", probability: "35.00", color: "#10b981" },
        { label: "No", probability: "65.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will India hold general elections in 2024?",
      description: "India election timing prediction",
      category: "Politics",
      endDate: "Dec 31, 2024",
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
      outcomes: [
        { label: "Yes", probability: "95.00", color: "#10b981" },
        { label: "No", probability: "5.00", color: "#ef4444" }
      ]
    },

    // SPORTS (5 markets)
    {
      title: "Will Messi win 2024 Ballon d'Or?",
      description: "Ballon d'Or 2024 winner prediction",
      category: "Sports",
      endDate: "Oct 31, 2024",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
      outcomes: [
        { label: "Yes", probability: "32.00", color: "#10b981" },
        { label: "No", probability: "68.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will Lakers win 2025 NBA Championship?",
      description: "NBA 2025 championship prediction",
      category: "Sports",
      endDate: "Jun 30, 2025",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
      outcomes: [
        { label: "Yes", probability: "18.00", color: "#10b981" },
        { label: "No", probability: "82.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will Man City win Premier League 2024-25?",
      description: "Premier League 2024-25 winner prediction",
      category: "Sports",
      endDate: "May 31, 2025",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
      outcomes: [
        { label: "Yes", probability: "58.00", color: "#10b981" },
        { label: "No", probability: "42.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will Djokovic win another Grand Slam in 2024?",
      description: "Djokovic Grand Slam 2024 prediction",
      category: "Sports",
      endDate: "Dec 31, 2024",
      image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      outcomes: [
        { label: "Yes", probability: "62.00", color: "#10b981" },
        { label: "No", probability: "38.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will USA win most medals at 2024 Olympics?",
      description: "Paris 2024 Olympics medal count prediction",
      category: "Sports",
      endDate: "Aug 11, 2024",
      image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800",
      outcomes: [
        { label: "Yes", probability: "75.00", color: "#10b981" },
        { label: "No", probability: "25.00", color: "#ef4444" }
      ]
    },

    // TECHNOLOGY (5 markets)
    {
      title: "Will Apple release AR glasses in 2025?",
      description: "Apple AR glasses launch prediction",
      category: "Technology",
      endDate: "Dec 31, 2025",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800",
      outcomes: [
        { label: "Yes", probability: "28.00", color: "#10b981" },
        { label: "No", probability: "72.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will GPT-5 be released by end of 2024?",
      description: "OpenAI GPT-5 release prediction",
      category: "Technology",
      endDate: "Dec 31, 2024",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      outcomes: [
        { label: "Yes", probability: "42.00", color: "#10b981" },
        { label: "No", probability: "58.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will Tesla launch $25k EV in 2025?",
      description: "Tesla affordable EV launch prediction",
      category: "Technology",
      endDate: "Dec 31, 2025",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
      outcomes: [
        { label: "Yes", probability: "35.00", color: "#10b981" },
        { label: "No", probability: "65.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will SpaceX land humans on Mars by 2030?",
      description: "SpaceX Mars mission prediction",
      category: "Technology",
      endDate: "Dec 31, 2030",
      image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800",
      outcomes: [
        { label: "Yes", probability: "22.00", color: "#10b981" },
        { label: "No", probability: "78.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will quantum computer break RSA-2048 by 2026?",
      description: "Quantum computing breakthrough prediction",
      category: "Technology",
      endDate: "Dec 31, 2026",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
      outcomes: [
        { label: "Yes", probability: "8.00", color: "#10b981" },
        { label: "No", probability: "92.00", color: "#ef4444" }
      ]
    },

    // ENTERTAINMENT (5 markets)
    {
      title: "Will Barbie 2 be announced in 2024?",
      description: "Barbie sequel announcement prediction",
      category: "Entertainment",
      endDate: "Dec 31, 2024",
      image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800",
      outcomes: [
        { label: "Yes", probability: "68.00", color: "#10b981" },
        { label: "No", probability: "32.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will Avatar 3 gross over $2B worldwide?",
      description: "Avatar 3 box office prediction",
      category: "Entertainment",
      endDate: "Dec 31, 2025",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
      outcomes: [
        { label: "Yes", probability: "55.00", color: "#10b981" },
        { label: "No", probability: "45.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will Taylor Swift win Album of the Year 2025?",
      description: "Grammy Awards 2025 prediction",
      category: "Entertainment",
      endDate: "Feb 28, 2025",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
      outcomes: [
        { label: "Yes", probability: "48.00", color: "#10b981" },
        { label: "No", probability: "52.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will Stranger Things S5 release in 2024?",
      description: "Stranger Things final season release prediction",
      category: "Entertainment",
      endDate: "Dec 31, 2024",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800",
      outcomes: [
        { label: "Yes", probability: "25.00", color: "#10b981" },
        { label: "No", probability: "75.00", color: "#ef4444" }
      ]
    },
    {
      title: "Will GTA 6 release in 2025?",
      description: "Grand Theft Auto 6 release date prediction",
      category: "Entertainment",
      endDate: "Dec 31, 2025",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800",
      outcomes: [
        { label: "Yes", probability: "82.00", color: "#10b981" },
        { label: "No", probability: "18.00", color: "#ef4444" }
      ]
    }
  ];

  for (const market of markets) {
    try {
      await storage.createMarket(
        {
          title: market.title,
          description: market.description,
          image: market.image,
          category: market.category,
          endDate: market.endDate,
          volume: "0",
          isFeatured: false,
          isResolved: false,
          marketType: "binary"
        } as any,
        market.outcomes.map((outcome) => ({
          marketId: 0,
          label: outcome.label,
          probability: outcome.probability,
          color: outcome.color
        }))
      );
      console.log(`✓ Created: ${market.title}`);
    } catch (error) {
      console.error(`✗ Failed to create: ${market.title}`, error);
    }
  }

  console.log("Real markets seeded successfully!");
}
