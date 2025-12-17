import { TrendingUp, DollarSign, Activity, Globe, Monitor, Trophy, Award, Zap } from "lucide-react";

export interface Outcome {
  id: string;
  label: string;
  probability: number;
  color: string;
}

export interface Market {
  id: string;
  title: string;
  image: string;
  volume: string;
  outcomes: Outcome[];
  category: string;
  endDate: string;
  isFeatured?: boolean;
}

export const CATEGORIES = [
  { id: "all", label: "All Markets", icon: Globe },
  { id: "crypto", label: "Crypto", icon: DollarSign },
  { id: "politics", label: "Politics", icon: Activity },
  { id: "tech", label: "Tech", icon: Monitor },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "pop-culture", label: "Pop Culture", icon: Award },
];

export const MOCK_MARKETS: Market[] = [
  {
    id: "1",
    title: "Bitcoin to hit $100k by end of 2025?",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop",
    volume: "$12.5M",
    category: "Crypto",
    endDate: "Dec 31, 2025",
    isFeatured: true,
    outcomes: [
      { id: "yes", label: "Yes", probability: 65, color: "bg-primary" },
      { id: "no", label: "No", probability: 35, color: "bg-destructive" },
    ],
  },
  {
    id: "2",
    title: "Will AGI be achieved before 2027?",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
    volume: "$45.2M",
    category: "Tech",
    endDate: "Jan 1, 2027",
    isFeatured: true,
    outcomes: [
      { id: "yes", label: "Yes", probability: 22, color: "bg-primary" },
      { id: "no", label: "No", probability: 78, color: "bg-destructive" },
    ],
  },
  {
    id: "3",
    title: "2028 US Presidential Election Winner",
    image: "https://images.unsplash.com/photo-1541872703-74c5963631df?q=80&w=2070&auto=format&fit=crop",
    volume: "$8.1M",
    category: "Politics",
    endDate: "Nov 7, 2028",
    outcomes: [
      { id: "dem", label: "Democrat", probability: 48, color: "bg-blue-500" },
      { id: "rep", label: "Republican", probability: 45, color: "bg-red-500" },
      { id: "other", label: "Other", probability: 7, color: "bg-yellow-500" },
    ],
  },
  {
    id: "4",
    title: "Super Bowl LIX Winner",
    image: "https://images.unsplash.com/photo-1611000273763-71887e504c5e?q=80&w=2070&auto=format&fit=crop",
    volume: "$3.2M",
    category: "Sports",
    endDate: "Feb 9, 2025",
    outcomes: [
      { id: "chiefs", label: "Chiefs", probability: 18, color: "bg-primary" },
      { id: "49ers", label: "49ers", probability: 15, color: "bg-secondary" },
      { id: "ravens", label: "Ravens", probability: 12, color: "bg-accent" },
    ],
  },
  {
    id: "5",
    title: "Will SpaceX land on Mars by 2030?",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop",
    volume: "$18.9M",
    category: "Tech",
    endDate: "Dec 31, 2030",
    outcomes: [
      { id: "yes", label: "Yes", probability: 42, color: "bg-primary" },
      { id: "no", label: "No", probability: 58, color: "bg-destructive" },
    ],
  },
  {
    id: "6",
    title: "Next James Bond Actor",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    volume: "$1.2M",
    category: "Pop Culture",
    endDate: "Dec 31, 2025",
    outcomes: [
      { id: "atj", label: "Aaron Taylor-Johnson", probability: 55, color: "bg-primary" },
      { id: "hc", label: "Henry Cavill", probability: 15, color: "bg-secondary" },
    ],
  },
  {
    id: "7",
    title: "Will GTA VI release in 2025?",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
    volume: "$5.6M",
    category: "Tech",
    endDate: "Dec 31, 2025",
    outcomes: [
      { id: "yes", label: "Yes", probability: 89, color: "bg-primary" },
      { id: "no", label: "No", probability: 11, color: "bg-destructive" },
    ],
  },
  {
    id: "8",
    title: "Ethereum Flippening (Market Cap > BTC) in 2025?",
    image: "https://images.unsplash.com/photo-1622790698141-94e30457ef12?q=80&w=2072&auto=format&fit=crop",
    volume: "$9.4M",
    category: "Crypto",
    endDate: "Dec 31, 2025",
    outcomes: [
      { id: "yes", label: "Yes", probability: 12, color: "bg-primary" },
      { id: "no", label: "No", probability: 88, color: "bg-destructive" },
    ],
  },
  {
    id: "9",
    title: "Who will win the 2026 World Cup?",
    image: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=2000&auto=format&fit=crop",
    volume: "$2.1M",
    category: "Sports",
    endDate: "July 19, 2026",
    outcomes: [
      { id: "fra", label: "France", probability: 20, color: "bg-blue-600" },
      { id: "bra", label: "Brazil", probability: 18, color: "bg-yellow-400" },
      { id: "eng", label: "England", probability: 15, color: "bg-white" },
    ],
  },
];
