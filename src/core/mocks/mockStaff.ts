export interface StaffMember {
  id: string;
  name: string;
  role: 'Master Stylist' | 'Senior Colorist' | 'Esthetician' | 'Nail Artist' | 'Massage Therapist' | 'Salon Manager';
  email: string;
  phone: string;
  avatarUrl: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  status: 'active' | 'on_break' | 'off_duty';
  commissionRatePercent: number;
  monthlyRevenueGenerated: number;
}

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'stf_1',
    name: 'Elena Rostova',
    role: 'Master Stylist',
    email: 'elena.r@salonos.com',
    phone: '+1 (555) 234-5678',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    reviewsCount: 142,
    specialties: ['French Balayage', 'Precision Cuts', 'Bridal Updos'],
    status: 'active',
    commissionRatePercent: 45,
    monthlyRevenueGenerated: 14250,
  },
  {
    id: 'stf_2',
    name: 'Marcus Vance',
    role: 'Senior Colorist',
    email: 'marcus.v@salonos.com',
    phone: '+1 (555) 876-5432',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    rating: 4.91,
    reviewsCount: 98,
    specialties: ['Blonde Highlights', 'Color Correction', 'Men’s Cuts'],
    status: 'active',
    commissionRatePercent: 40,
    monthlyRevenueGenerated: 11800,
  },
  {
    id: 'stf_3',
    name: 'Sophia Chen',
    role: 'Esthetician',
    email: 'sophia.c@salonos.com',
    phone: '+1 (555) 345-6789',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 4.98,
    reviewsCount: 186,
    specialties: ['HydraFacials', 'Chemical Peels', 'Micro-needling'],
    status: 'active',
    commissionRatePercent: 35,
    monthlyRevenueGenerated: 9400,
  },
  {
    id: 'stf_4',
    name: 'Chloe Dubois',
    role: 'Nail Artist',
    email: 'chloe.d@salonos.com',
    phone: '+1 (555) 987-6543',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.88,
    reviewsCount: 114,
    specialties: ['Russian Gel', '3D Nail Art', 'Spa Pedicures'],
    status: 'on_break',
    commissionRatePercent: 30,
    monthlyRevenueGenerated: 6200,
  },
];
