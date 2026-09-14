export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  totalVisits: number;
  totalSpent: number;
  lastVisitDate: string;
  tags: ('VIP' | 'Regular' | 'New' | 'High Value' | 'Dormant')[];
  notes?: string;
  preferredStylist?: string;
}

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    name: 'Victoria Sterling',
    email: 'victoria.s@example.com',
    phone: '+1 (555) 111-2233',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    totalVisits: 18,
    totalSpent: 3450,
    lastVisitDate: '2026-07-20',
    tags: ['VIP', 'High Value'],
    notes: 'Prefers sparkling water upon arrival. Allergic to sulfate products.',
    preferredStylist: 'Elena Rostova',
  },
  {
    id: 'cust_2',
    name: 'Julian Hayes',
    email: 'j.hayes@example.com',
    phone: '+1 (555) 444-5566',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    totalVisits: 12,
    totalSpent: 1280,
    lastVisitDate: '2026-07-18',
    tags: ['Regular'],
    notes: 'Always books executive haircut every 3 weeks.',
    preferredStylist: 'Marcus Vance',
  },
  {
    id: 'cust_3',
    name: 'Camila Rodriguez',
    email: 'camila.r@example.com',
    phone: '+1 (555) 777-8899',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    totalVisits: 24,
    totalSpent: 4890,
    lastVisitDate: '2026-07-25',
    tags: ['VIP', 'High Value'],
    notes: 'Regular Balayage & HydraFacial customer.',
    preferredStylist: 'Elena Rostova',
  },
  {
    id: 'cust_4',
    name: 'Harrison Forde',
    email: 'harrison.f@example.com',
    phone: '+1 (555) 222-3344',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    totalVisits: 2,
    totalSpent: 260,
    lastVisitDate: '2026-07-10',
    tags: ['New'],
    preferredStylist: 'Sophia Chen',
  },
];
