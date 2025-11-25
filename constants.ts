
import { CardDesign, InterestOption, AIMode, Account, Contact, UserState, Perk, SocialPost, Transaction, GhostCard, SharedTab } from './types';

export const INTERESTS: InterestOption[] = [
  { id: 'travel', label: 'Global Travel', emoji: '✈️' },
  { id: 'tech', label: 'Tech & Gadgets', emoji: '💻' },
  { id: 'crypto', label: 'Crypto', emoji: '₿' },
  { id: 'food', label: 'Fine Dining', emoji: '🍣' },
  { id: 'sustainability', label: 'Green Living', emoji: '🌿' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'investing', label: 'Stocks', emoji: '📈' },
  { id: 'fitness', label: 'Wellness', emoji: '🧘' },
];

export const AI_MODES: AIMode[] = [
  { 
    id: 'strategist', 
    label: 'The Strategist', 
    description: 'Ruthless optimization. I\'ll find every wasted penny.', 
    icon: '♟️' 
  },
  { 
    id: 'hype-man', 
    label: 'The Hype Man', 
    description: 'High energy encouragement when you hit your goals.', 
    icon: '🔥' 
  },
  { 
    id: 'zen-guide', 
    label: 'Zen Guide', 
    description: 'Stress-free, minimalist updates only when necessary.', 
    icon: '🎋' 
  }
];

export const FINANCIAL_GOALS = [
  "Build Emergency Fund",
  "Travel the World",
  "Passive Income",
  "Clear Debt",
  "Buy a Home",
  "Crypto Portfolio"
];

export const CARD_DESIGNS: CardDesign[] = [
  {
    id: 'neon-pulse',
    name: 'Neon Pulse',
    gradient: 'bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500',
    textColor: 'text-white'
  },
  {
    id: 'obsidian-stealth',
    name: 'Obsidian Stealth',
    gradient: 'bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700',
    textColor: 'text-zinc-300'
  },
  {
    id: 'holographic-dream',
    name: 'Holo Dream',
    gradient: 'bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400',
    textColor: 'text-indigo-900'
  },
  {
    id: 'cyber-citrus',
    name: 'Cyber Citrus',
    gradient: 'bg-gradient-to-br from-lime-400 via-emerald-500 to-teal-600',
    textColor: 'text-white'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1, merchant: 'Starbucks', amount: -5.40, category: 'Food', date: 'Today', recurring: false, location: 'Seattle, WA', status: 'Completed' },
  { id: 2, merchant: 'Uber', amount: -12.50, category: 'Transport', date: 'Yesterday', recurring: false, location: 'San Francisco, CA', status: 'Completed' },
  { id: 3, merchant: 'Spotify', amount: -14.99, category: 'Subscription', date: 'Yesterday', recurring: true, location: 'Digital Service', status: 'Completed' },
  { id: 4, merchant: 'Salary', amount: 3200.00, category: 'Income', date: '2 days ago', recurring: true, location: 'Direct Deposit', status: 'Completed' },
  { id: 5, merchant: 'Trader Joes', amount: -85.20, category: 'Groceries', date: '3 days ago', recurring: false, location: 'Austin, TX', status: 'Completed' },
  { id: 6, merchant: 'Netflix', amount: -19.99, category: 'Subscription', date: '4 days ago', recurring: true, location: 'Digital Service', status: 'Completed' },
];

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'main-checking',
    name: 'Nova Checking',
    type: 'CHECKING',
    balance: 2450.89,
    accountNumber: '•••• 4291',
    isLocked: false
  },
  {
    id: 'credit-card',
    name: 'Nova Titanium',
    type: 'CREDIT',
    balance: -450.20,
    limit: 5000,
    dueDate: 'Due in 12 days',
    accountNumber: '•••• 8832',
    isLocked: false
  },
  {
    id: 'student-loan',
    name: 'Student Loan',
    type: 'LOAN',
    balance: -12500.00,
    dueDate: 'Auto-pay on 15th',
    accountNumber: '•••• 9921'
  }
];

export const MOCK_GHOST_CARDS: GhostCard[] = [
  {
    id: 'gc-1',
    name: 'Amazon One-Time',
    number: '4892 •••• •••• 9921',
    cvc: '992',
    expiry: '12/24',
    status: 'ACTIVE',
    maxSpend: 200
  },
  {
    id: 'gc-2',
    name: 'Sketchy Site',
    number: '5521 •••• •••• 1102',
    cvc: '123',
    expiry: '01/25',
    status: 'ACTIVE',
    maxSpend: 50
  }
];

export const MOCK_SHARED_TABS: SharedTab[] = [
  {
    id: 'tab-1',
    name: 'Weekend Trip',
    emoji: '🏔️',
    totalSpend: 840.50,
    myBalance: -15.50, // I owe
    members: [
      { name: 'Alex', avatarColor: 'bg-blue-500', balance: 120 }, // Owed 120
      { name: 'Sarah', avatarColor: 'bg-pink-500', balance: -45 }, // Owes 45
      { name: 'You', avatarColor: 'bg-indigo-500', balance: -15.50 } // Owes 15.50
    ]
  },
  {
    id: 'tab-2',
    name: 'Dinner Club',
    emoji: '🍷',
    totalSpend: 320.00,
    myBalance: 45.00, // I am owed
    members: [
      { name: 'Jordan', avatarColor: 'bg-green-500', balance: -80 }, // Owes 80
      { name: 'You', avatarColor: 'bg-indigo-500', balance: 45 } // Owed 45
    ]
  }
];

export const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Alex Chen', handle: 'alex.c@gmail.com', avatarColor: 'bg-blue-500', recent: true },
  { id: '2', name: 'Sarah Jones', handle: '555-0123', avatarColor: 'bg-pink-500', recent: true },
  { id: '3', name: 'Mom', handle: '555-0199', avatarColor: 'bg-purple-500', recent: true },
  { id: '4', name: 'Jordan Lee', handle: 'j.lee@tech.com', avatarColor: 'bg-green-500' },
];

export const MOCK_PERKS: Perk[] = [
  { id: '1', merchant: 'Spotify', offer: '5% Cashback', category: 'Subscription', expires: 'Exp. in 3 days', logoBg: 'bg-[#1DB954]', activated: false, aiReason: 'You spend $15/mo here' },
  { id: '2', merchant: 'Whole Foods', offer: '$10 off $50+', category: 'Groceries', expires: 'Exp. in 1 week', logoBg: 'bg-[#00674b]', activated: false, aiReason: 'Frequent shopper location' },
  { id: '3', merchant: 'Uber', offer: '10% off rides', category: 'Travel', expires: 'Exp. tomorrow', logoBg: 'bg-black', activated: true, aiReason: 'High usage on weekends' },
  { id: '4', merchant: 'Nike', offer: '3% Cashback', category: 'Retail', expires: 'Exp. in 5 days', logoBg: 'bg-zinc-100 text-black', activated: false, aiReason: 'Based on style interests' },
];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: '1',
    user: 'Alex Chen',
    avatarColor: 'bg-blue-500',
    type: 'SAVING',
    content: 'saved $45/mo by switching gas stations based on Nova\'s fuel map. Ask him which one he\'s going to? ⛽',
    time: '2h ago',
    likes: 14,
    comments: [{ id: 'c1', user: 'You', text: 'Whoa, share the location!', time: '1h ago' }],
    metric: '+$45/mo'
  },
  {
    id: '2',
    user: 'Susan Wright',
    avatarColor: 'bg-purple-500',
    type: 'MILESTONE',
    content: 'made $850 on crypto yesterday. Nova detected a 12% portfolio jump during the rally. 🚀',
    time: '4h ago',
    likes: 42,
    comments: [{ id: 'c2', user: 'Alex', text: 'To the moon! 🌕', time: '30m ago' }],
    metric: '+$850'
  },
  {
    id: '3',
    user: 'Sarah Jones',
    avatarColor: 'bg-pink-500',
    type: 'GOAL',
    content: 'is 60% of the way to our "Japan 2025" squad trip. You are currently at 45%. Time to catch up!',
    time: '5h ago',
    likes: 32,
    comments: [{ id: 'c3', user: 'Jordan', text: 'I\'m buying sushi 🍣', time: '1h ago' }],
    metric: 'Squad Goal',
    groupData: {
      goalName: "Japan Trip 2025",
      members: [
        { name: "Sarah", avatarColor: "bg-pink-500", progress: 60, status: "On Track" },
        { name: "You", avatarColor: "bg-indigo-500", progress: 45, status: "Catching Up" },
        { name: "Alex", avatarColor: "bg-blue-500", progress: 75, status: "Ahead" },
        { name: "Jordan", avatarColor: "bg-green-500", progress: 20, status: "Lagging" }
      ]
    }
  },
  {
    id: '4',
    user: 'Jordan Lee',
    avatarColor: 'bg-green-500',
    type: 'MILESTONE',
    content: 'just paid off their credit card balance entirely. Debt free mode activated.',
    time: '1d ago',
    likes: 89,
    comments: [{ id: 'c4', user: 'You', text: 'Huge!! Congrats', time: '1d ago' }],
    metric: 'Debt Free',
    debtData: {
      count: 4,
      friends: ["Jordan Lee", "Alex Chen", "You", "Maria G."]
    }
  }
];

export const POCKET_COLORS = [
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-green-500',
  'from-violet-500 to-purple-500'
];

export const POCKET_TEMPLATES = [
  { name: 'Rainy Day', emoji: '☔', color: 'from-blue-400 to-indigo-500' },
  { name: 'Japan Trip', emoji: '🗾', color: 'from-red-400 to-pink-500' },
  { name: 'New Mac', emoji: '💻', color: 'from-zinc-400 to-zinc-600' },
  { name: 'Festival', emoji: '🎫', color: 'from-purple-400 to-fuchsia-500' },
];

export const DEFAULT_USER: UserState = {
  name: "Alex Mercer",
  email: "alex.mercer@nova.bank",
  phoneNumber: "555-0199",
  interests: ["tech", "travel", "investing"],
  persona: {
    personaName: "Digital Nomad",
    description: "Experiences over things. You invest in memories and markets.",
    suggestedPockets: ["✈️ World Tour", "📷 Gear Fund", "☕ Coffee"]
  },
  aiSettings: {
    modeId: 'strategist',
    goals: ["Travel the World", "Passive Income"],
    accountsLinked: true,
    welcomeMessage: "Market's up 2.4% today. Good time to review your portfolio, Alex."
  },
  selectedCardId: 'neon-pulse'
};
