// tax-calculator.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Deduction {
  category: string;
  amount: number;
  description: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  deductible?: boolean;
}

interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  baseAmount: number;
}

@Component({
  selector: 'app-tax-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tax-calculator.component.html',
  styleUrls: ['./tax-calculator.component.scss']
})
export class TaxCalculatorComponent implements OnInit {
  monthlyIncome: number = 67500;
  monthlyExpenses: number = 14779;
  transactionFilter: 'all' | 'income' | 'expense' = 'all';
  isRegistered: boolean = false;

  deductions: Deduction[] = [
    { category: 'Home Office', amount: 2500, description: 'Portion of rent/bond, utilities' },
    { category: 'Equipment', amount: 1200, description: 'Cameras, computers, software' },
    { category: 'Internet & Phone', amount: 800, description: 'Business use portion' },
    { category: 'Marketing', amount: 1500, description: 'Advertising, promotions' },
    { category: 'Professional Fees', amount: 1000, description: 'Accountant, legal fees' },
    { category: 'Travel', amount: 500, description: 'Business-related travel' },
    { category: 'Training', amount: 300, description: 'Courses, workshops' }
  ];

  transactions: Transaction[] = [
    { id: '1', date: '2025-10-25', description: 'YouTube Ad Revenue', amount: 15000, type: 'income', category: 'Content Creation' },
    { id: '2', date: '2025-10-24', description: 'Brand Sponsorship - TechCo', amount: 25000, type: 'income', category: 'Sponsorship' },
    { id: '3', date: '2025-10-23', description: 'Camera Equipment', amount: 8500, type: 'expense', category: 'Equipment', deductible: true },
    { id: '4', date: '2025-10-22', description: 'Adobe Creative Cloud', amount: 680, type: 'expense', category: 'Software', deductible: true },
    { id: '5', date: '2025-10-20', description: 'Instagram Collaboration', amount: 12000, type: 'income', category: 'Content Creation' },
    { id: '6', date: '2025-10-18', description: 'Internet Bill', amount: 899, type: 'expense', category: 'Utilities', deductible: true },
    { id: '7', date: '2025-10-15', description: 'Affiliate Commissions', amount: 5600, type: 'income', category: 'Affiliate' },
    { id: '8', date: '2025-10-12', description: 'Marketing Campaign', amount: 3200, type: 'expense', category: 'Marketing', deductible: true },
    { id: '9', date: '2025-10-10', description: 'TikTok Creator Fund', amount: 8900, type: 'income', category: 'Content Creation' },
    { id: '10', date: '2025-10-08', description: 'Accounting Services', amount: 1500, type: 'expense', category: 'Professional Fees', deductible: true }
  ];

  taxBrackets: TaxBracket[] = [
    { min: 0, max: 237100, rate: 0.18, baseAmount: 0 },
    { min: 237101, max: 370500, rate: 0.26, baseAmount: 42678 },
    { min: 370501, max: 512800, rate: 0.31, baseAmount: 77362 },
    { min: 512801, max: 673000, rate: 0.36, baseAmount: 121475 },
    { min: 673001, max: 857900, rate: 0.39, baseAmount: 179147 },
    { min: 857901, max: 1817000, rate: 0.41, baseAmount: 251258 },
    { min: 1817001, max: null, rate: 0.45, baseAmount: 644489 }
  ];

  primaryRebate: number = 17235;

  complianceChecklist: string[] = [
    'Declare all income from all sources',
    'Register as provisional taxpayer if income > R95,750',
    'Make provisional payments (Aug 31 & Feb 28)',
    'Keep detailed records of business expenses',
    'Submit annual tax return by deadline',
    'Claim only legitimate deductions',
    'Consider VAT registration if turnover > R1M',
    'Maintain separate business bank account'
  ];

  importantNotes: string[] = [
    'Influencers and gig workers are self-employed by SARS',
    'Declare income from all platforms and sources',
    'Penalties apply for late registration',
    'Consult a tax professional for complex situations',
    'Keep records for at least 5 years'
  ];

  ngOnInit(): void {}

  get projectedAnnualIncome(): number {
    return this.monthlyIncome * 12;
  }

  get totalDeductions(): number {
    return this.deductions.reduce((sum, d) => sum + d.amount, 0);
  }

  get transactionDeductions(): number {
    return this.transactions
      .filter(t => t.type === 'expense' && t.deductible)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get annualDeductions(): number {
    return (this.totalDeductions + this.transactionDeductions) * 12;
  }

  get taxableIncome(): number {
    return Math.max(0, this.projectedAnnualIncome - this.annualDeductions);
  }

  get annualTaxLiability(): number {
    let tax = 0;
    for (const bracket of this.taxBrackets) {
      if (this.taxableIncome > bracket.min) {
        const taxableInBracket = bracket.max 
          ? Math.min(this.taxableIncome, bracket.max) - bracket.min + 1
          : this.taxableIncome - bracket.min;
        tax = bracket.baseAmount + (taxableInBracket * bracket.rate);
      }
    }
    return Math.max(0, tax - this.primaryRebate);
  }

  get monthlyTaxAmount(): number {
    return this.annualTaxLiability / 12;
  }

  get effectiveTaxRate(): number {
    return this.taxableIncome > 0 ? (this.annualTaxLiability / this.taxableIncome) * 100 : 0;
  }

  get provisionalPayment1(): number {
    return this.annualTaxLiability * 0.5;
  }

  get provisionalPayment2(): number {
    return this.annualTaxLiability * 0.5;
  }

  get currentBracket(): TaxBracket | undefined {
    return this.taxBrackets.find(b => 
      this.projectedAnnualIncome >= b.min && (b.max === null || this.projectedAnnualIncome <= b.max)
    );
  }

  get requiresRegistration(): boolean {
    return this.projectedAnnualIncome > 95750;
  }

  get filteredTransactions(): Transaction[] {
    return this.transactionFilter === 'all' 
      ? this.transactions 
      : this.transactions.filter(t => t.type === this.transactionFilter);
  }

  get taxBracketProgress(): number {
    return Math.min((this.projectedAnnualIncome / 1817000) * 100, 100);
  }

  get netMonthly(): number {
    return this.monthlyIncome - this.monthlyExpenses;
  }

  updateDeduction(index: number, value: string): void {
    this.deductions[index].amount = parseFloat(value) || 0;
  }

  setTransactionFilter(filter: 'all' | 'income' | 'expense'): void {
    this.transactionFilter = filter;
  }

  toggleRegistration(): void {
    this.isRegistered = !this.isRegistered;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount).replace('ZAR', 'R');
  }

  getCurrentBracketRate(): number {
    return ((this.currentBracket?.rate || 0) * 100);
  }
}