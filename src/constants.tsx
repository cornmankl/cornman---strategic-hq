import React from 'react';
import type {
  ProductCardData,
  GeneratorCardData,
  Sale,
  InventoryItem,
  Customer,
  Invoice,
  RoadmapPhase,
  ComposerCardData,
} from './types';
import {
  InstagramIcon,
  TikTokIcon,
  TwitterIcon,
  FacebookIcon,
  YouTubeIcon,
} from './components/Icons';

export const BASE_PROMPT =
  "You are CORNMAN's brand strategist. Your brand is a cool, urban, streetwear-inspired corn-in-a-cup brand in Kuala Lumpur, Malaysia. The tagline is 'Street Corn. Elevated.' The vibe is moody, cinematic, and authentic. The target audience is the youth, creatives, and hustlers of KL. The brand name is CORNMAN, stylized as CRNMN. The parent company is THE FAMOUS MARKET. Generate responses in a concise, structured format. Keep responses in Bahasa Melayu unless the context implies English (like a slogan).";

// Product & Brand Development
export const PRODUCT_CARDS: ProductCardData[] = [
  {
    id: 'flavor-lab',
    type: 'generator',
    title: '✨ FLAVOR LAB',
    description: 'Cipta perisa edisi terhad yang akan meletup di pasaran.',
    buttonText: 'GENERATE FLAVOR',
    prompt: `${BASE_PROMPT} Generate a concept for a new, limited-edition flavor drop. Provide a cool, catchy name, a short description of the flavor profile, and a tagline for it. Format it as: \n\nNAMA: [Name]\n\nPERISA: [Description]\n\nTAGLINE: [Tagline]`,
  },
  {
    id: 'visual-lab',
    type: 'image',
    title: '📸 VISUAL LAB',
    description: 'Jana imej untuk mood board, konsep produk, atau visual media sosial.',
    buttonText: 'GENERATE IMAGE',
    placeholder:
      'Cth: "Streetwear photography of a person eating corn in a cup at night in Kuala Lumpur, cinematic, moody lighting..."',
  },
  {
    id: 'brand-saga',
    type: 'generator',
    title: '✨ BRAND SAGA',
    description: 'Karang kisah jenama anda yang akan memberi inspirasi dan membina hubungan.',
    buttonText: 'GENERATE BRAND STORY',
    prompt: `${BASE_PROMPT} Write a short, powerful brand story (around 100-150 words) for the 'About Us' section of the website. It should capture the essence of the 'hustle', the urban KL vibe, and the brand's philosophy of 'Street Corn. Elevated.'`,
  },
];

// Strategic Growth
export const GROWTH_CARDS: GeneratorCardData[] = [
  {
    id: 'collab-planner',
    type: 'generator',
    title: '✨ COLLAB PLANNER',
    description: 'Cari dan rancang kolaborasi dengan jenama atau artis tempatan yang sehaluan.',
    buttonText: 'GENERATE COLLAB IDEA',
    prompt: `${BASE_PROMPT} Generate a strategic collaboration idea with a specific type of local KL partner (e.g., a local coffee shop, a graffiti artist, a music event). Describe the concept of the collaboration and the mutual benefits. Format as: \n\nRAKAN KOLABORASI: [Partner]\n\nKONSEP KOLABORASI: [Concept]\n\nFAEDAH BERSAMA: [Mutual Benefits]`,
  },
  {
    id: 'customer-persona',
    type: 'generator',
    title: '✨ CUSTOMER PERSONA',
    description:
      'Fahami pelanggan sasaran anda dengan lebih mendalam untuk pemasaran yang lebih berkesan.',
    buttonText: 'GENERATE PERSONA',
    prompt: `${BASE_PROMPT} Generate a detailed customer persona for a typical CORNMAN customer. Include their age, occupation, interests, motivations, and frustrations. This will help in creating targeted marketing. Format as a list.`,
  },
  {
    id: 'competitor-watch',
    type: 'generator',
    title: '✨ COMPETITOR WATCH',
    description: 'Analisa pergerakan pesaing dan cari peluang untuk CORNMAN menonjol.',
    buttonText: 'ANALYZE COMPETITOR',
    prompt: `${BASE_PROMPT} Provide a brief analysis of a potential local competitor (e.g., a trendy cafe or another street food vendor in KL). Identify one of their strengths and one of their weaknesses, and suggest one way CORNMAN can differentiate itself. Format as: \n\nJENIS PESAING: [Competitor]\n\nKEKUATAN: [Strength]\n\nKELEMAHAN: [Weakness]\n\nPELUANG: [How CORNMAN can win]`,
  },
];

// Business & Operations
export const BIZ_OPS_CARDS: GeneratorCardData[] = [
  {
    id: 'pricing-advisor',
    type: 'generator',
    title: '✨ PRICING ADVISOR',
    description: 'Dapatkan cadangan harga strategik untuk produk baharu anda.',
    buttonText: 'GET PRICING STRATEGY',
    prompt: `${BASE_PROMPT} Generate a pricing strategy for a new CORNMAN product. Consider the premium streetwear vibe, target audience's willingness to pay, and typical KL street food prices. Suggest a price point and a short justification. Format as: \n\nCADANGAN HARGA: [Price]\n\nJUSTIFIKASI: [Reasoning]`,
  },
  {
    id: 'adcopy-generator',
    type: 'generator',
    title: '✨ AD COPY GENERATOR',
    description: 'Cipta ayat iklan yang memukau untuk kempen media sosial anda.',
    buttonText: 'GENERATE AD COPY',
    prompt: `${BASE_PROMPT} Generate a short, punchy ad copy for a Facebook/Instagram ad. It should have a clear hook, highlight a key benefit (e.g., unique flavor, cool vibe), and a strong call-to-action. Format as: \n\nHEADLINE: [Headline]\n\nBODY: [Ad text]\n\nCALL-TO-ACTION: [CTA]`,
  },
  {
    id: 'pitch-assistant',
    type: 'generator',
    title: '✨ PITCH ASSISTANT',
    description: 'Sediakan poin-poin penting untuk membentangkan idea anda kepada rakan kongsi.',
    buttonText: 'GENERATE PITCH POINTS',
    prompt: `${BASE_PROMPT} Generate 3 key talking points for a short business pitch to a potential collaborator or pop-up space owner. The points should highlight the brand's unique selling proposition, its target audience, and the value it brings. Format as a numbered list.`,
  },
];

// Community & Events
export const COMMUNITY_CARDS: GeneratorCardData[] = [
  {
    id: 'event-planner',
    type: 'generator',
    title: '✨ EVENT CONCEPT PLANNER',
    description: 'Rancang acara pelancaran atau pop-up yang akan menjadi bualan ramai di KL.',
    buttonText: 'GENERATE EVENT CONCEPT',
    prompt: `${BASE_PROMPT} Generate a cool, on-brand event concept for CORNMAN. The event should be low-cost but high-impact, in line with a streetwear F&B brand in KL. Format it as: \n\nNAMA ACARA: [Name]\n\nKONSEP: [Concept]\n\nSTRATEGI HYPE: [How to promote it]`,
  },
  {
    id: 'faq-builder',
    type: 'generator',
    title: '✨ FAQ & RESPONSE BUILDER',
    description: "Sediakan jawapan pantas dan 'on-brand' untuk soalan lazim pelanggan.",
    buttonText: 'GENERATE FAQ',
    prompt: `${BASE_PROMPT} Generate 3 common Frequently Asked Questions (FAQs) a customer might have for CORNMAN, along with on-brand, cool, and helpful answers. The tone should be helpful but still have the streetwear swag. Format as Q&A.`,
  },
];

// Empire Expansion
export const EXPANSION_CARDS: GeneratorCardData[] = [
  {
    id: 'franchise-planner',
    type: 'generator',
    title: '✨ FRANCHISE MODEL PLANNER',
    description: 'Mula fikirkan cara untuk mengembangkan jenama CORNMAN ke seluruh negara.',
    buttonText: 'GENERATE FRANCHISE MODEL',
    prompt: `${BASE_PROMPT} Generate a basic concept for a CORNMAN franchise model. Outline key considerations for a potential franchisee profile, the support system provided, and the basic fee structure. This is for initial planning. Format as a list.`,
  },
  {
    id: 'financial-projections',
    type: 'generator',
    title: '✨ FINANCIAL PROJECTIONS AI',
    description: 'Dapatkan unjuran kewangan ringkas untuk merancang keuntungan anda.',
    buttonText: 'GENERATE FINANCIAL PROJECTION',
    prompt: `${BASE_PROMPT} Generate a simplified, high-level monthly financial projection for one CORNMAN kiosk. Assume an estimated monthly revenue and provide a breakdown of potential costs (COGS, rent, salary, utilities) and calculate an estimated net profit. Format as a simple financial summary.`,
  },
  {
    id: 'crisis-comms',
    type: 'generator',
    title: '✨ CRISIS COMMS ADVISOR',
    description: 'Bersedia untuk sebarang krisis dengan pelan komunikasi yang mantap.',
    buttonText: 'GENERATE CRISIS RESPONSE',
    prompt: `${BASE_PROMPT} Generate a crisis communication response plan for a hypothetical negative scenario (e.g., a viral bad review). Provide key talking points and a draft public statement that is professional, empathetic, and on-brand. Format as: \n\nSENARIO: [Hypothetical Crisis]\n\nPOIN UTAMA: [Key Points]\n\nDRAF KENYATAAN: [Statement]`,
  },
];

// Marketing & Hype
export const MARKETING_CARDS: Omit<ComposerCardData, 'onSchedule'>[] = [
  {
    id: 'facebook',
    title: 'Facebook',
    description: 'Karang pos yang membina komuniti dan interaksi.',
    generateButtonText: '✨ GENERATE FB POST',
    postButtonText: 'Salin & Buka FB',
    scheduleButtonText: 'Jadualkan Pos',
    promptGenerator: () =>
      `${BASE_PROMPT} Generate a Facebook post for CORNMAN designed to spark conversation and build community. The post should be engaging, perhaps asking a question to followers or sharing a short, relatable story about the hustle in KL. Keep it friendly and authentic.`,
    postUrl: 'https://www.facebook.com/',
    icon: <FacebookIcon />,
  },
  {
    id: 'instagram',
    title: 'Instagram',
    description: 'Jana idea dan terus sediakan pos anda.',
    generateButtonText: '✨ GENERATE IG POST',
    postButtonText: 'Salin & Buka IG',
    scheduleButtonText: 'Jadualkan Pos',
    promptGenerator: () =>
      `${BASE_PROMPT} Generate a new, cool Instagram post caption. It should be short, punchy, and reflect one of the content pillars (THE DRIP, THE GRIND, THE CONCRETE JUNGLE, THE CREW). Include 3-4 relevant hashtags.`,
    postUrl: 'https://www.instagram.com',
    icon: <InstagramIcon />,
  },
  {
    id: 'tiktok',
    title: 'TikTok',
    description: 'Dapatkan idea dan terus ke laman TikTok.',
    generateButtonText: '✨ GENERATE TIKTOK IDEA',
    postButtonText: 'Salin & Buka TikTok',
    scheduleButtonText: 'Jadualkan Idea',
    promptGenerator: () =>
      `${BASE_PROMPT} Generate a creative TikTok video idea. It should be easy to shoot with a phone. Describe the visual concept and suggest a type of trending audio to use (e.g., lo-fi hip hop, fast-paced transition sound). Format it as: \n\nKONSEP: [Video concept]\n\nAUDIO: [Audio suggestion]\n\nKAPSYEN: [A short, catchy caption with hashtags]`,
    postUrl: 'https://www.tiktok.com/upload',
    icon: <TikTokIcon />,
  },
  {
    id: 'youtube',
    title: 'YouTube',
    description: 'Rancang idea video pendek (Shorts) atau kandungan panjang.',
    generateButtonText: '✨ GENERATE YOUTUBE IDEA',
    postButtonText: 'Salin & Buka YouTube',
    scheduleButtonText: 'Jadualkan Idea',
    promptGenerator: () =>
      `${BASE_PROMPT} Generate a YouTube video idea for CORNMAN. Specify if it's for a Short or a long-form video. Describe the concept, a potential title, and key talking points or visual shots. The video should be cinematic and capture the KL street vibe. Format it as: \n\nFORMAT: [Shorts/Video]\n\nTAJUK: [Catchy Title]\n\nKONSEP: [Video concept]\n\nKANDUNGAN: [Key points/shots]`,
    postUrl: 'https://www.youtube.com/upload',
    icon: <YouTubeIcon />,
  },
  {
    id: 'twitter',
    title: 'X (Twitter)',
    description: 'Cipta ciapan dan terus kongsi di X.',
    generateButtonText: '✨ GENERATE TWEET',
    postButtonText: 'Salin & Buka X',
    scheduleButtonText: 'Jadualkan Ciapan',
    promptGenerator: () =>
      `${BASE_PROMPT} Generate a short, punchy, and engaging tweet. It could be a quick update, a question for the followers, or a relatable comment about the KL hustle. Include one or two relevant hashtags.`,
    postUrl: 'https://twitter.com/intent/tweet',
    icon: <TwitterIcon />,
  },
];

export const SYSTEM_HANDOVER_DOCS = {
  docs: `**Sistem Pengenalan**\nSistem Autopilot CORNMAN adalah sebuah dashboard bersepadu yang direka untuk mengautomasikan operasi teras jenama anda. Dari penjanaan kandungan AI hingga pemantauan jualan dan inventori, sistem ini adalah pusat arahan anda.\n\n**Ciri-ciri Utama:**\n- **Penjana Kandungan:** Cipta kapsyen media sosial, idea produk, dan banyak lagi dengan kuasa AI.\n- **Penjadual Automatik:** Jadualkan kandungan anda dan biarkan sistem menerbitkannya secara automatik.\n- **Dashboard Operasi:** Pantau jualan dan inventori secara langsung.\n- **Bot WhatsApp:** Urus operasi asas seperti semakan stok melalui arahan WhatsApp.`,
  tutorial: `**Cara Menggunakan:**\n1.  **Jana Idea:** Gunakan kad-kad di bawah untuk menjana idea untuk pemasaran, produk, dll.\n2.  **Jadualkan Kandungan:** Dalam kad pemasaran, selepas menjana kapsyen, klik 'Jadualkan Pos'.\n3.  **Pantau Dashboard:** Perhatikan jualan masuk dan paras stok dalam Dashboard Operasi.\n4.  **Guna Bot:** Taip arahan seperti 'check stok' atau 'order stok [nama item]' dalam WhatsApp Command Center untuk tindakan pantas.`,
};

export const ROADMAP_DATA: RoadmapPhase[] = [
  {
    id: 'phase1',
    title: 'Fasa 1: Pelancaran & Pengesahan Pasaran',
    weeks: 4,
    status: 'Complete',
    tasks: [
      'Sediakan kiosk pertama',
      'Lancarkan di media sosial',
      'Kumpul maklum balas pelanggan awal',
      'Capai 100 jualan pertama',
    ],
  },
  {
    id: 'phase2',
    title: 'Fasa 2: Penambahbaikan Operasi & Pertumbuhan Awal',
    weeks: 8,
    status: 'In Progress',
    tasks: [
      'Optimumkan rantaian bekalan',
      'Lancar perisa edisi terhad pertama',
      'Rancang kolaborasi pertama',
      'Automasikan penjadualan kandungan',
    ],
  },
  {
    id: 'phase3',
    title: 'Fasa 3: Penskalaan & Pengembangan Jenama',
    weeks: 12,
    status: 'Planned',
    tasks: [
      'Teroka lokasi kiosk kedua',
      'Bina laman web tempahan dalam talian',
      'Mulakan program kesetiaan pelanggan',
      'Rancang model francais awal',
    ],
  },
];

// --- MOCK BACKEND DATA ---
export const MOCK_INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'corn', name: 'Jagung Biji', stock: 15, threshold: 20, unit: 'kg', cost: 3.2, price: 8.9, category: 'Grains', supplier: 'Local Farm' },
  { id: 'milk', name: 'Susu Pekat', stock: 50, threshold: 25, unit: 'can', cost: 2.1, price: 4.5, category: 'Dairy', supplier: 'Dairy Co' },
  { id: 'butter', name: 'Mentega', stock: 45, threshold: 25, unit: 'block', cost: 5.0, price: 12.0, category: 'Dairy', supplier: 'Dairy Co' },
  { id: 'cheese', name: 'Serbuk Keju', stock: 30, threshold: 20, unit: 'pack', cost: 4.2, price: 9.8, category: 'Dairy', supplier: 'Dairy Co' },
  { id: 'cup', name: 'Cawan (Besar)', stock: 250, threshold: 100, unit: 'pcs', cost: 0.2, price: 0.5, category: 'Packaging', supplier: 'Supply Co' },
  { id: 'cup-small', name: 'Cawan (Kecil)', stock: 80, threshold: 100, unit: 'pcs', cost: 0.15, price: 0.4, category: 'Packaging', supplier: 'Supply Co' },
];

export const MOCK_INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust1',
    name: 'Ahmad Faisal',
    phone: '012-3456789',
    lastSeen: '18/07/2024',
    totalSpent: 124.5,
  },
  {
    id: 'cust2',
    name: 'Siti Nurhaliza',
    phone: '019-8765432',
    lastSeen: '17/07/2024',
    totalSpent: 78.2,
  },
  {
    id: 'cust3',
    name: 'Ravi Kumar',
    phone: '017-5551234',
    lastSeen: '15/07/2024',
    totalSpent: 45.6,
  },
];

export const MOCK_INITIAL_SALES: Sale[] = [
  { 
    id: 'sale1', 
    product: 'CRNMN Signature', 
    amount: 8.9, 
    time: '14:32', 
    customerId: 'cust1',
    items: [{ id: 'item1', name: 'CRNMN Signature', quantity: 1, price: 8.9 }],
    total: 8.9,
    createdAt: '2024-07-18T14:32:00Z',
    status: 'completed'
  },
  { 
    id: 'sale2', 
    product: 'Spicy Sambal', 
    amount: 9.9, 
    time: '14:35', 
    customerId: 'cust2',
    items: [{ id: 'item2', name: 'Spicy Sambal', quantity: 1, price: 9.9 }],
    total: 9.9,
    createdAt: '2024-07-18T14:35:00Z',
    status: 'completed'
  },
  { 
    id: 'sale3', 
    product: 'CRNMN Signature', 
    amount: 8.9, 
    time: '14:41', 
    customerId: 'cust1',
    items: [{ id: 'item3', name: 'CRNMN Signature', quantity: 1, price: 8.9 }],
    total: 8.9,
    createdAt: '2024-07-18T14:41:00Z',
    status: 'completed'
  },
];

export const MOCK_INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-1001',
    customerName: 'Syarikat Maju Jaya',
    date: '15/07/2024',
    amount: 350.0,
    status: 'paid',
  },
  {
    id: 'INV-1002',
    customerName: 'KL Event Planners',
    date: '16/07/2024',
    amount: 500.0,
    status: 'pending',
  },
  {
    id: 'INV-1003',
    customerName: 'The Startup Hub',
    date: '10/06/2024',
    amount: 250.0,
    status: 'overdue',
  },
];
