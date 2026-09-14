export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  color: string;
}

export const MOCK_SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cat_hair', name: 'Hair Styling & Cuts', description: 'Precision cuts, blowouts, and custom styling' },
  { id: 'cat_color', name: 'Hair Color & Balayage', description: 'Full highlights, root touchups, and balayage artistry' },
  { id: 'cat_nails', name: 'Nails & Manicure', description: 'Gel manicures, pedicures, and nail art' },
  { id: 'cat_skin', name: 'Skincare & Facials', description: 'HydraFacials, chemical peels, and glowing skincare' },
  { id: 'cat_spa', name: 'Spa & Body Massage', description: 'Relaxation, deep tissue, and hot stone therapy' },
];

export const MOCK_SERVICES: ServiceItem[] = [
  {
    id: 'srv_women_cut',
    categoryId: 'cat_hair',
    categoryName: 'Hair Styling & Cuts',
    name: 'Signature Women’s Haircut & Blowout',
    description: 'Includes scalp massage, shampoo conditioning, customized haircut, and red-carpet blowout.',
    durationMinutes: 60,
    price: 120,
    isActive: true,
    color: '#7C3AED',
  },
  {
    id: 'srv_men_cut',
    categoryId: 'cat_hair',
    categoryName: 'Hair Styling & Cuts',
    name: 'Executive Men’s Haircut & Styling',
    description: 'Precision clipper and scissor cut with hot towel finish and scalp treatment.',
    durationMinutes: 45,
    price: 65,
    isActive: true,
    color: '#3B82F6',
  },
  {
    id: 'srv_balayage',
    categoryId: 'cat_color',
    categoryName: 'Hair Color & Balayage',
    name: 'Luxury French Balayage & Gloss',
    description: 'Hand-painted dimension highlights with gloss toner and bond repair treatment.',
    durationMinutes: 150,
    price: 280,
    isActive: true,
    color: '#EC4899',
  },
  {
    id: 'srv_gel_mani',
    categoryId: 'cat_nails',
    categoryName: 'Nails & Manicure',
    name: 'Russian Gel Manicure',
    description: 'Detailed cuticle care, long-lasting gel coating, and hand hydration treatment.',
    durationMinutes: 75,
    price: 85,
    isActive: true,
    color: '#10B981',
  },
  {
    id: 'srv_hydra_facial',
    categoryId: 'cat_skin',
    categoryName: 'Skincare & Facials',
    name: 'Radiance Glow HydraFacial',
    description: 'Deep pore cleansing, LED light therapy, and hyaluronic acid serum infusion.',
    durationMinutes: 60,
    price: 195,
    isActive: true,
    color: '#F59E0B',
  },
  {
    id: 'srv_deep_massage',
    categoryId: 'cat_spa',
    categoryName: 'Spa & Body Massage',
    name: 'Deep Tissue Muscle Relief Massage',
    description: 'Targeted therapeutic deep tissue work with organic aromatherapy oils.',
    durationMinutes: 90,
    price: 160,
    isActive: true,
    color: '#8B5CF6',
  },
];
