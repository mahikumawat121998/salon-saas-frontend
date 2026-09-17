import { axiosClient } from "./axios-client";
import { ApiResponse } from "@/types/api";

export interface SalaryComponentItem {
  id?: string;
  name: string;
  type: "EARNING" | "DEDUCTION";
  calculationType: "FIXED_AMOUNT" | "PERCENTAGE_OF_BASE";
  value: number;
  isTaxable?: boolean;
}

export interface CommissionTierItem {
  id?: string;
  minRevenueVolume: number;
  maxRevenueVolume?: number;
  commissionRate: number;
}

export interface CommissionRuleItem {
  id?: string;
  type: "SERVICE" | "PRODUCT";
  calcMode: "FLAT_PERCENTAGE" | "FLAT_AMOUNT" | "TIERED_VOLUME";
  flatRate?: number;
  tiers?: CommissionTierItem[];
}

export interface StaffSalaryConfig {
  id?: string;
  staffId: string;
  payStructureType: "MONTHLY" | "DAILY" | "HOURLY" | "FIXED_AND_COMMISSION" | "COMMISSION_ONLY";
  baseSalary: number;
  dailyRate?: number;
  hourlyRate?: number;
  overtimeRatePerHour?: number;
  overtimeMultiplier?: number;
  components?: SalaryComponentItem[];
  commissionRules?: CommissionRuleItem[];
}

export interface StaffSalaryConfigResponse {
  staffId: string;
  staffName: string;
  phone?: string;
  status: string;
  salaryConfig: StaffSalaryConfig | null;
}

export interface PayslipItem {
  id: string;
  name: string;
  category: string;
  type: "EARNING" | "DEDUCTION";
  amount: number;
}

export interface Payslip {
  id: string;
  tenantId: string;
  payrollPeriodId: string;
  staffId: string;
  payStructureType: string;
  totalWorkingDays: number;
  presentDays: number;
  unpaidLeaveDays: number;
  paidLeaveDays: number;
  overtimeHours: number;
  baseEarned: number;
  overtimePay: number;
  serviceCommission: number;
  productCommission: number;
  allowancesTotal: number;
  bonusAmount: number;
  grossPay: number;
  leaveDeduction: number;
  otherDeductionsTotal: number;
  statutoryDeductionsTotal: number;
  totalDeductions: number;
  netPay: number;
  status: "DRAFT" | "APPROVED" | "PAID" | "ON_HOLD";
  paymentMode?: "CASH" | "BANK_TRANSFER" | "UPI" | "CHEQUE" | "OTHER";
  paymentReference?: string;
  paymentNotes?: string;
  paidAt?: string;
  staff: {
    id: string;
    name: string;
    phone?: string;
  };
  items: PayslipItem[];
}

export interface PayrollPeriod {
  id: string;
  tenantId: string;
  name: string;
  startDate: string;
  endDate: string;
  workingDaysCount: number;
  status: "OPEN" | "DRAFT" | "IN_REVIEW" | "APPROVED" | "PAID" | "CANCELLED";
  processedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  paidAt?: string;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  payslips?: Payslip[];
  _count?: {
    payslips: number;
  };
}

export interface PayrollSummary {
  totalPeriods: number;
  totals: {
    grossPay: number;
    totalDeductions: number;
    netPay: number;
    serviceCommission: number;
    productCommission: number;
  };
  recentPeriods: PayrollPeriod[];
}

export interface CommissionBreakdownItem {
  staffName: string;
  serviceCommission: number;
  productCommission: number;
  totalCommission: number;
}

export const payrollApiService = {
  // Staff Salary Configurations
  async getStaffConfigs(): Promise<StaffSalaryConfigResponse[]> {
    const response = await axiosClient.get<ApiResponse<StaffSalaryConfigResponse[]>>("/payroll/configurations");
    return response.data.data;
  },

  async getStaffConfigById(staffId: string): Promise<StaffSalaryConfigResponse> {
    const response = await axiosClient.get<ApiResponse<StaffSalaryConfigResponse>>(`/payroll/configurations/${staffId}`);
    return response.data.data;
  },

  async updateSalaryConfig(staffId: string, config: StaffSalaryConfig): Promise<StaffSalaryConfig> {
    const response = await axiosClient.put<ApiResponse<StaffSalaryConfig>>(`/payroll/configurations/${staffId}`, config);
    return response.data.data;
  },

  // Payroll Periods
  async getPeriods(): Promise<PayrollPeriod[]> {
    const response = await axiosClient.get<ApiResponse<PayrollPeriod[]>>("/payroll/periods");
    return response.data.data;
  },

  async getPeriodById(id: string): Promise<PayrollPeriod> {
    const response = await axiosClient.get<ApiResponse<PayrollPeriod>>(`/payroll/periods/${id}`);
    return response.data.data;
  },

  async createPeriod(period: { name: string; startDate: string; endDate: string; workingDaysCount: number }): Promise<PayrollPeriod> {
    const response = await axiosClient.post<ApiResponse<PayrollPeriod>>("/payroll/periods", period);
    return response.data.data;
  },

  async calculatePeriod(id: string): Promise<PayrollPeriod> {
    const response = await axiosClient.post<ApiResponse<PayrollPeriod>>(`/payroll/periods/${id}/calculate`);
    return response.data.data;
  },

  async updatePeriodStatus(id: string, status: string): Promise<PayrollPeriod> {
    const response = await axiosClient.patch<ApiResponse<PayrollPeriod>>(`/payroll/periods/${id}/status`, { status });
    return response.data.data;
  },

  // Payslips
  async adjustPayslip(id: string, adjustment: { bonusAmount?: number; overtimeHours?: number; unpaidLeaveDays?: number; manualDeduction?: number; adjustmentReason?: string }): Promise<Payslip> {
    const response = await axiosClient.patch<ApiResponse<Payslip>>(`/payroll/payslips/${id}/adjustments`, adjustment);
    return response.data.data;
  },

  async disbursePayslip(id: string, disburse: { paymentMode: string; paymentReference?: string; paymentNotes?: string }): Promise<Payslip> {
    const response = await axiosClient.post<ApiResponse<Payslip>>(`/payroll/payslips/${id}/disburse`, disburse);
    return response.data.data;
  },

  // Reports
  async getSummary(): Promise<PayrollSummary> {
    const response = await axiosClient.get<ApiResponse<PayrollSummary>>("/payroll/reports/summary");
    return response.data.data;
  },

  async getCommissionBreakdown(): Promise<CommissionBreakdownItem[]> {
    const response = await axiosClient.get<ApiResponse<CommissionBreakdownItem[]>>("/payroll/reports/commissions");
    return response.data.data;
  },
};
