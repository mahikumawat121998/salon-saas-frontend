export interface DashboardMetrics {
  totalRevenueThisMonth: number;
  revenueGrowthPercent: number;
  totalAppointments: number;
  appointmentsGrowthPercent: number;
  totalCustomers: number;
  newCustomersThisMonth: number;
  averageTicketSize: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  appointmentsCount: number;
}

export const MOCK_DASHBOARD_METRICS: DashboardMetrics = {
  totalRevenueThisMonth: 42850,
  revenueGrowthPercent: 14.8,
  totalAppointments: 342,
  appointmentsGrowthPercent: 9.2,
  totalCustomers: 1280,
  newCustomersThisMonth: 64,
  averageTicketSize: 125.29,
};

export const MOCK_REVENUE_CHART: RevenueDataPoint[] = [
  { date: 'Jul 01', revenue: 1420, appointmentsCount: 12 },
  { date: 'Jul 05', revenue: 1850, appointmentsCount: 15 },
  { date: 'Jul 10', revenue: 2100, appointmentsCount: 18 },
  { date: 'Jul 15', revenue: 1980, appointmentsCount: 16 },
  { date: 'Jul 20', revenue: 2650, appointmentsCount: 22 },
  { date: 'Jul 25', revenue: 3100, appointmentsCount: 25 },
  { date: 'Jul 27', revenue: 2890, appointmentsCount: 21 },
];
