export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  serviceName: string;
  stylistName: string;
  stylistAvatar?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  price: number;
  status: 'confirmed' | 'in-progress' | 'completed' | 'pending' | 'cancelled';
  outletName: string;
}

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_101',
    customerName: 'Victoria Sterling',
    customerPhone: '+1 (555) 111-2233',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    serviceName: 'Signature Women’s Haircut & Blowout',
    stylistName: 'Elena Rostova',
    stylistAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    date: '2026-07-27',
    startTime: '10:00',
    endTime: '11:00',
    price: 120,
    status: 'in-progress',
    outletName: 'Manhattan Flagship - 5th Ave',
  },
  {
    id: 'apt_102',
    customerName: 'Julian Hayes',
    customerPhone: '+1 (555) 444-5566',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    serviceName: 'Executive Men’s Haircut & Styling',
    stylistName: 'Marcus Vance',
    stylistAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    date: '2026-07-27',
    startTime: '11:30',
    endTime: '12:15',
    price: 65,
    status: 'confirmed',
    outletName: 'Manhattan Flagship - 5th Ave',
  },
  {
    id: 'apt_103',
    customerName: 'Camila Rodriguez',
    customerPhone: '+1 (555) 777-8899',
    customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    serviceName: 'Luxury French Balayage & Gloss',
    stylistName: 'Elena Rostova',
    stylistAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    date: '2026-07-27',
    startTime: '13:00',
    endTime: '15:30',
    price: 280,
    status: 'confirmed',
    outletName: 'Manhattan Flagship - 5th Ave',
  },
  {
    id: 'apt_104',
    customerName: 'Harrison Forde',
    customerPhone: '+1 (555) 222-3344',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    serviceName: 'Radiance Glow HydraFacial',
    stylistName: 'Sophia Chen',
    stylistAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    date: '2026-07-27',
    startTime: '16:00',
    endTime: '17:00',
    price: 195,
    status: 'pending',
    outletName: 'Manhattan Flagship - 5th Ave',
  },
  {
    id: 'apt_105',
    customerName: 'Giselle Meyer',
    customerPhone: '+1 (555) 666-7788',
    serviceName: 'Russian Gel Manicure',
    stylistName: 'Chloe Dubois',
    stylistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    date: '2026-07-26',
    startTime: '14:00',
    endTime: '15:15',
    price: 85,
    status: 'completed',
    outletName: 'Manhattan Flagship - 5th Ave',
  },
];
