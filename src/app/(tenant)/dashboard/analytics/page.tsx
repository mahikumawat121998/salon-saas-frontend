'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
import {
  CreditCard,
  Calendar,
  Users,
  ShoppingBag,
  ArrowUpRight,
  Filter,
  Download,
  FileText,
  ChevronRight,
  TrendingUp,
  BarChart2,
  PieChart,
  Scissors,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import { Avatar } from '@/shared/ui/Avatar';

// Sparkline Component
function SparklineChart({ color, data }: { color: string; data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 30;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// Line Chart Component for Revenue Overview
function RevenueLineChart() {
  return (
    <Box sx={{ width: '100%', height: 260, position: 'relative', pt: 2, pb: 1 }}>
      <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Gridlines */}
        <line x1="0" y1="0" x2="500" y2="0" stroke="#F3F4F6" strokeDasharray="4 4" />
        <line x1="0" y1="40" x2="500" y2="40" stroke="#F3F4F6" strokeDasharray="4 4" />
        <line x1="0" y1="80" x2="500" y2="80" stroke="#F3F4F6" strokeDasharray="4 4" />
        <line x1="0" y1="120" x2="500" y2="120" stroke="#F3F4F6" strokeDasharray="4 4" />
        <line x1="0" y1="160" x2="500" y2="160" stroke="#F3F4F6" strokeDasharray="4 4" />

        {/* Last Week Dashed Line */}
        <path
          d="M 10,100 C 60,110 100,70 150,80 C 200,90 250,30 300,50 C 350,70 400,100 490,60"
          fill="none"
          stroke="#9CA3AF"
          strokeWidth="2"
          strokeDasharray="5 5"
        />

        {/* This Week Gradient Fill */}
        <path
          d="M 10,70 Q 75,130 150,90 T 300,30 T 420,80 T 490,40 L 490,170 L 10,170 Z"
          fill="url(#revenueGrad)"
        />

        {/* This Week Solid Line */}
        <path
          d="M 10,70 Q 75,130 150,90 T 300,30 T 420,80 T 490,40"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="3"
        />

        {/* Interactive Data Points */}
        {[
          { x: 10, y: 70 },
          { x: 90, y: 120 },
          { x: 170, y: 90 },
          { x: 250, y: 90 },
          { x: 330, y: 30 },
          { x: 410, y: 80 },
          { x: 490, y: 40 },
        ].map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r="4.5"
            fill="#FFFFFF"
            stroke="#7C3AED"
            strokeWidth="3"
          />
        ))}
      </svg>

      {/* X-Axis Day Labels */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mt: 1 }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <Typography key={day} variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.72rem' }}>
            {day}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

// Donut Chart Component
function DonutChart({
  centerLabel,
  centerSub,
  slices,
}: {
  centerLabel: string;
  centerSub: string;
  slices: { percentage: number; color: string }[];
}) {
  const size = 150;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentAngle = 0;

  return (
    <Box sx={{ position: 'relative', width: size, height: size, mx: 'auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {slices.map((slice, idx) => {
          const strokeDashoffset = circumference - (slice.percentage / 100) * circumference;
          const rotation = (currentAngle / 100) * 360;
          currentAngle += slice.percentage;

          return (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transformOrigin: 'center',
                transform: `rotate(${rotation}deg)`,
                transition: 'all 0.4s ease',
              }}
            />
          );
        })}
      </svg>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827', lineHeight: 1 }}>
          {centerLabel}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem', mt: 0.2 }}>
          {centerSub}
        </Typography>
      </Box>
    </Box>
  );
}

export default function AnalyticsReportsPage() {
  const [dateRange, setDateRange] = useState<string>('week');

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', maxWidth: '100%', pb: 4 }}>
          {/* Header Title Section & Controls */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 3,
            }}
          >
            <PageHeader
              title="Reports"
              subtitle="Track performance, analyze trends and make data-driven decisions."
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Select
                size="small"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 40, minWidth: 200 }}
              >
                <MenuItem value="week">📅 21 Jul 2025 - 27 Jul 2025</MenuItem>
                <MenuItem value="month">📅 01 Jul 2025 - 31 Jul 2025</MenuItem>
                <MenuItem value="quarter">📅 Q3 2025</MenuItem>
              </Select>

              <Button
                variant="outlined"
                startIcon={<Filter size={16} />}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#E5E7EB',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  py: 0.9,
                  px: 2,
                  textTransform: 'none',
                }}
              >
                Filters
              </Button>

              <Button
                variant="contained"
                startIcon={<Download size={18} />}
                sx={{
                  borderRadius: '12px',
                  backgroundColor: '#7C3AED',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  py: 1,
                  px: 2.5,
                  textTransform: 'none',
                  boxShadow: '0px 4px 14px rgba(124, 58, 237, 0.25)',
                  '&:hover': { backgroundColor: '#6D28D9' },
                }}
              >
                Export Report
              </Button>
            </Box>
          </Box>

          {/* Top 4 KPI Summary Cards with Sparkline Charts */}
          <Grid container spacing={3} sx={{ mb: 3.5 }}>
            {/* Card 1: Total Revenue */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', p: 2.5, border: '1px solid #F3F4F6', boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '14px',
                          backgroundColor: '#F3E8FF',
                          color: '#7C3AED',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CreditCard size={22} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Total Revenue
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', lineHeight: 1.1, mt: 0.2 }}>
                          $3,420
                        </Typography>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                          <ArrowUpRight size={12} /> 12.5% vs last week
                        </Typography>
                      </Box>
                    </Box>

                    <SparklineChart color="#7C3AED" data={[20, 35, 25, 45, 30, 55, 65]} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 2: Total Appointments */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', p: 2.5, border: '1px solid #F3F4F6', boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '14px',
                          backgroundColor: '#ECFDF5',
                          color: '#10B981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Calendar size={22} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Total Appointments
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', lineHeight: 1.1, mt: 0.2 }}>
                          124
                        </Typography>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                          <ArrowUpRight size={12} /> 8.3% vs last week
                        </Typography>
                      </Box>
                    </Box>

                    <SparklineChart color="#10B981" data={[15, 22, 18, 30, 25, 38, 42]} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 3: New Customers */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', p: 2.5, border: '1px solid #F3F4F6', boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '14px',
                          backgroundColor: '#FFF7ED',
                          color: '#F97316',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Users size={22} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          New Customers
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', lineHeight: 1.1, mt: 0.2 }}>
                          18
                        </Typography>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                          <ArrowUpRight size={12} /> 20% vs last week
                        </Typography>
                      </Box>
                    </Box>

                    <SparklineChart color="#F97316" data={[8, 12, 10, 16, 14, 22, 25]} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 4: Product Sales */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', p: 2.5, border: '1px solid #F3F4F6', boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '14px',
                          backgroundColor: '#EFF6FF',
                          color: '#3B82F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ShoppingBag size={22} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Product Sales
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', lineHeight: 1.1, mt: 0.2 }}>
                          $1,250
                        </Typography>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                          <ArrowUpRight size={12} /> 15.7% vs last week
                        </Typography>
                      </Box>
                    </Box>

                    <SparklineChart color="#3B82F6" data={[10, 18, 15, 28, 22, 35, 40]} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Middle Section: 3 Analytics Charts Cards */}
          <Grid container spacing={3} sx={{ mb: 3.5 }}>
            {/* Chart 1: Revenue Overview (Line Chart - 46%) */}
            <Grid size={{ xs: 12, lg: 5.5 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, backgroundColor: '#FFFFFF', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
                    Revenue Overview
                  </Typography>

                  <Select size="small" defaultValue="daily" sx={{ borderRadius: '10px', fontSize: '0.78125rem', height: 32 }}>
                    <MenuItem value="daily">Daily View</MenuItem>
                    <MenuItem value="weekly">Weekly View</MenuItem>
                  </Select>
                </Box>

                {/* Legend Bar */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 14, height: 3, backgroundColor: '#7C3AED', borderRadius: 2 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#4B5563', fontSize: '0.75rem' }}>
                      This Week
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 14, height: 2, borderTop: '2px dashed #9CA3AF' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#9CA3AF', fontSize: '0.75rem' }}>
                      Last Week
                    </Typography>
                  </Box>
                </Box>

                <RevenueLineChart />
              </Card>
            </Grid>

            {/* Chart 2: Revenue by Category (Donut Chart - 27%) */}
            <Grid size={{ xs: 12, sm: 6, lg: 3.25 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, backgroundColor: '#FFFFFF', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
                    Revenue by Category
                  </Typography>

                  <Select size="small" defaultValue="this_week" sx={{ borderRadius: '10px', fontSize: '0.78125rem', height: 32 }}>
                    <MenuItem value="this_week">This Week</MenuItem>
                  </Select>
                </Box>

                <DonutChart
                  centerLabel="$3,420"
                  centerSub="Total"
                  slices={[
                    { percentage: 61.9, color: '#7C3AED' },
                    { percentage: 36.5, color: '#F59E0B' },
                    { percentage: 8.8, color: '#F97316' },
                  ]}
                />

                {/* Slices Legend Breakdown */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#7C3AED' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>
                        Services
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                      $2,120 <span style={{ color: '#9CA3AF', fontWeight: 500 }}>(61.9%)</span>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>
                        Products
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                      $1,250 <span style={{ color: '#9CA3AF', fontWeight: 500 }}>(36.5%)</span>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F97316' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>
                        Packages
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                      $300 <span style={{ color: '#9CA3AF', fontWeight: 500 }}>(8.8%)</span>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>
                        Others
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                      $-250 <span style={{ color: '#9CA3AF', fontWeight: 500 }}>(-7.2%)</span>
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Chart 3: Appointments Overview (Donut Chart - 27%) */}
            <Grid size={{ xs: 12, sm: 6, lg: 3.25 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, backgroundColor: '#FFFFFF', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
                    Appointments Overview
                  </Typography>

                  <Select size="small" defaultValue="this_week" sx={{ borderRadius: '10px', fontSize: '0.78125rem', height: 32 }}>
                    <MenuItem value="this_week">This Week</MenuItem>
                  </Select>
                </Box>

                <DonutChart
                  centerLabel="124"
                  centerSub="Total"
                  slices={[
                    { percentage: 64.5, color: '#10B981' },
                    { percentage: 16.1, color: '#3B82F6' },
                    { percentage: 12.1, color: '#EF4444' },
                    { percentage: 7.3, color: '#F59E0B' },
                  ]}
                />

                {/* Slices Legend Breakdown */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>
                        Completed
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                      80 <span style={{ color: '#9CA3AF', fontWeight: 500 }}>(64.5%)</span>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>
                        Cancelled
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                      15 <span style={{ color: '#9CA3AF', fontWeight: 500 }}>(12.1%)</span>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>
                        No Show
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                      9 <span style={{ color: '#9CA3AF', fontWeight: 500 }}>(7.3%)</span>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>
                        Scheduled
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                      20 <span style={{ color: '#9CA3AF', fontWeight: 500 }}>(16.1%)</span>
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Bottom Section: 3 Data Tables / List Cards */}
          <Grid container spacing={3}>
            {/* Table 1: Top Services */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827', mb: 2 }}>
                  Top Services
                </Typography>

                <TableContainer sx={{ flexGrow: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '& th': { borderBottom: '1px solid #F3F4F6', py: 1 } }}>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.72rem' }}>Service</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.72rem' }}>Appointments</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.72rem' }}>Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        { name: 'Haircut', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&auto=format&fit=crop&q=80', count: 45, revenue: '$1,125' },
                        { name: 'Hair Color', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&auto=format&fit=crop&q=80', count: 28, revenue: '$840' },
                        { name: 'Beard Trim', img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=100&auto=format&fit=crop&q=80', count: 20, revenue: '$400' },
                        { name: 'Hair Spa', img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=100&auto=format&fit=crop&q=80', count: 18, revenue: '$810' },
                        { name: 'Facial', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&auto=format&fit=crop&q=80', count: 15, revenue: '$900' },
                      ].map((item, idx) => (
                        <TableRow key={idx} sx={{ '& td': { borderBottom: '1px solid #F9FAFB', py: 1.2 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                              <Box
                                component="img"
                                src={item.img}
                                alt={item.name}
                                sx={{ width: 30, height: 30, borderRadius: '8px', objectFit: 'cover' }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                                {item.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>
                            {item.count}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.8125rem', fontWeight: 800, color: '#111827' }}>
                            {item.revenue}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #F3F4F6' }}>
                  <Button
                    size="small"
                    color="primary"
                    endIcon={<ChevronRight size={16} />}
                    sx={{ fontWeight: 700, fontSize: '0.8125rem', textTransform: 'none' }}
                  >
                    View All Services
                  </Button>
                </Box>
              </Card>
            </Grid>

            {/* Table 2: Top Staff Performance */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827', mb: 2 }}>
                  Top Staff Performance
                </Typography>

                <TableContainer sx={{ flexGrow: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '& th': { borderBottom: '1px solid #F3F4F6', py: 1 } }}>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.72rem' }}>Staff</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.72rem' }}>Appointments</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.72rem' }}>Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        { name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80', count: 32, revenue: '$1,120' },
                        { name: 'Sophia Martinez', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80', count: 28, revenue: '$980' },
                        { name: 'Ryan Cooper', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', count: 20, revenue: '$610' },
                        { name: 'Olivia Rhye', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', count: 18, revenue: '$520' },
                        { name: 'James Carter', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', count: 15, revenue: '$460' },
                      ].map((item, idx) => (
                        <TableRow key={idx} sx={{ '& td': { borderBottom: '1px solid #F9FAFB', py: 1.2 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                              <Avatar name={item.name} src={item.avatar} sx={{ width: 30, height: 30 }} />
                              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                                {item.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>
                            {item.count}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.8125rem', fontWeight: 800, color: '#111827' }}>
                            {item.revenue}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #F3F4F6' }}>
                  <Button
                    size="small"
                    color="primary"
                    endIcon={<ChevronRight size={16} />}
                    sx={{ fontWeight: 700, fontSize: '0.8125rem', textTransform: 'none' }}
                  >
                    View All Staff
                  </Button>
                </Box>
              </Card>
            </Grid>

            {/* Table 3: Recent Reports Download List */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827', mb: 2 }}>
                  Recent Reports
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, flexGrow: 1 }}>
                  {[
                    { title: 'Sales Summary Report', time: 'Generated on 27 Jul 2025, 10:30 AM', color: '#7C3AED', bg: '#F3E8FF' },
                    { title: 'Appointment Report', time: 'Generated on 27 Jul 2025, 10:30 AM', color: '#10B981', bg: '#ECFDF5' },
                    { title: 'Staff Performance Report', time: 'Generated on 27 Jul 2025, 10:30 AM', color: '#F97316', bg: '#FFF7ED' },
                    { title: 'Inventory Report', time: 'Generated on 27 Jul 2025, 10:30 AM', color: '#EF4444', bg: '#FEE2E2' },
                    { title: 'Customer Report', time: 'Generated on 27 Jul 2025, 10:30 AM', color: '#3B82F6', bg: '#EFF6FF' },
                  ].map((report, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1.2,
                        borderRadius: '12px',
                        backgroundColor: '#FAFAFC',
                        border: '1px solid #F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: '8px',
                            backgroundColor: report.bg,
                            color: report.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FileText size={18} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                            {report.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                            {report.time}
                          </Typography>
                        </Box>
                      </Box>

                      <IconButton size="small" sx={{ border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                        <Download size={15} color="#6B7280" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ textAlign: 'center', pt: 2, mt: 1, borderTop: '1px solid #F3F4F6' }}>
                  <Button
                    size="small"
                    color="primary"
                    endIcon={<ChevronRight size={16} />}
                    sx={{ fontWeight: 700, fontSize: '0.8125rem', textTransform: 'none' }}
                  >
                    View All Reports
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
