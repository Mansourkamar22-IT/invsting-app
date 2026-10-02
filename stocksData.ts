import { StockQuote, WishContact } from '../types';

export const INITIAL_STOCKS: StockQuote[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 142.80,
    change: +5.65,
    changePercent: +4.12,
    high52w: 153.20,
    low52w: 75.60,
    marketCap: '$3.51 Trillion',
    peRatio: 52.4,
    volume: '54.2M',
    category: 'AI & Chips',
    description: 'Pioneer of GPU-accelerated computing and the dominant architect of AI infrastructure, Blackwell architecture, and high-performance datacenter chips.',
    history: {
      '1D': [137.2, 138.5, 137.9, 139.4, 140.8, 141.6, 141.2, 142.8],
      '1W': [132.0, 134.5, 136.1, 135.2, 138.0, 140.4, 142.8],
      '1M': [118.5, 122.3, 125.8, 129.4, 134.0, 138.2, 142.8],
      '1Y': [48.5, 62.0, 78.4, 95.0, 112.5, 128.0, 142.8],
    }
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 232.40,
    change: +2.15,
    changePercent: +0.93,
    high52w: 237.20,
    low52w: 164.08,
    marketCap: '$3.45 Trillion',
    peRatio: 34.2,
    volume: '42.1M',
    category: 'Big Tech',
    description: 'Global technology giant behind iPhone, Mac, iPad, Services ecosystem, and Apple Intelligence personal AI system.',
    history: {
      '1D': [230.1, 230.8, 231.2, 231.5, 232.0, 231.8, 232.4],
      '1W': [227.0, 228.4, 229.1, 230.5, 231.0, 231.8, 232.4],
      '1M': [218.0, 221.5, 224.0, 226.5, 229.0, 230.8, 232.4],
      '1Y': [172.0, 184.0, 192.5, 205.0, 216.0, 225.0, 232.4],
    }
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 448.90,
    change: +4.80,
    changePercent: +1.08,
    high52w: 468.35,
    low52w: 366.50,
    marketCap: '$3.33 Trillion',
    peRatio: 36.8,
    volume: '21.8M',
    category: 'Big Tech',
    description: 'Enterprise cloud and AI platform powerhouse including Azure, Microsoft 365, Copilot, GitHub, and major partnership with OpenAI.',
    history: {
      '1D': [444.2, 445.6, 446.0, 447.1, 447.8, 448.2, 448.9],
      '1W': [439.0, 441.5, 443.0, 445.2, 446.8, 447.5, 448.9],
      '1M': [425.0, 431.0, 436.5, 440.0, 444.0, 446.5, 448.9],
      '1Y': [330.0, 360.0, 385.0, 410.0, 428.0, 440.0, 448.9],
    }
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 254.10,
    change: -3.20,
    changePercent: -1.24,
    high52w: 271.00,
    low52w: 138.80,
    marketCap: '$808 Billion',
    peRatio: 64.5,
    volume: '68.4M',
    category: 'EV & Mobility',
    description: 'Electric vehicles, energy storage solutions, Full Self-Driving (FSD) autonomous robotics, and Optimus humanoid robot platform.',
    history: {
      '1D': [258.0, 256.5, 255.0, 254.2, 253.8, 254.9, 254.1],
      '1W': [245.0, 248.5, 252.0, 257.0, 256.0, 255.2, 254.1],
      '1M': [210.0, 222.0, 235.0, 248.0, 258.0, 256.0, 254.1],
      '1Y': [215.0, 180.0, 155.0, 175.0, 210.0, 240.0, 254.1],
    }
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 196.50,
    change: +2.90,
    changePercent: +1.50,
    high52w: 201.20,
    low52w: 118.35,
    marketCap: '$2.05 Trillion',
    peRatio: 41.2,
    volume: '34.7M',
    category: 'E-Commerce',
    description: 'Global e-commerce leader, Amazon Web Services (AWS) cloud computing infrastructure, and generative AI developer services.',
    history: {
      '1D': [193.5, 194.2, 195.0, 195.8, 196.1, 196.2, 196.5],
      '1W': [190.0, 191.5, 193.0, 194.5, 195.2, 195.8, 196.5],
      '1M': [182.0, 186.0, 189.5, 192.0, 194.5, 195.5, 196.5],
      '1Y': [125.0, 142.0, 158.0, 175.0, 185.0, 192.0, 196.5],
    }
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 165.75,
    change: +6.30,
    changePercent: +3.95,
    high52w: 227.30,
    low52w: 94.04,
    marketCap: '$268 Billion',
    peRatio: 48.7,
    volume: '41.2M',
    category: 'Semiconductors',
    description: 'Developer of Ryzen desktop and EPYC server processors, and Instinct MI300X AI accelerators challenging data center workloads.',
    history: {
      '1D': [159.2, 161.0, 162.4, 163.8, 164.9, 165.2, 165.75],
      '1W': [152.0, 155.0, 158.4, 160.2, 162.5, 164.0, 165.75],
      '1M': [140.0, 145.0, 151.0, 156.0, 161.0, 163.5, 165.75],
      '1Y': [102.0, 120.0, 145.0, 180.0, 165.0, 158.0, 165.75],
    }
  }
];

export const WISH_AXX_CONTACTS: WishContact[] = [
  { tag: '@wish_alex', name: 'Alex Carter', avatar: '👨‍💼', phone: '+1 (555) 234-8901', network: 'Wish Money' },
  { tag: '@axx_sarah', name: 'Sarah Chen', avatar: '👩‍💻', phone: '+1 (555) 872-3490', network: 'Axx Pay' },
  { tag: '@wish_merchant', name: 'Wish Express Store', avatar: '🏪', phone: '+1 (800) 947-4663', network: 'Wish Money' },
  { tag: '@nividia_invest', name: 'Tech Syndicate Fund', avatar: '⚡', phone: '+1 (555) 431-7720', network: 'Axx Pay' },
  { tag: '@michael_t', name: 'Michael Torres', avatar: '🧗‍♂️', phone: '+1 (555) 609-1123', network: 'Wish Money' }
];
