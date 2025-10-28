import { Component, OnInit } from '@angular/core';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  smoothed: number;
}

interface Metrics {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  avgMonthlyIncome: number;
  smoothedIncome: number;
}

interface CategoryExpense {
  name: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-finance-dashboard',
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.scss']
})
export class FinanceDashboardComponent implements OnInit {
  activeTab: string = 'overview';
  timeframe: string = '6M';

  monthlyData: MonthlyData[] = [
    { month: 'Jan', income: 4200, expenses: 2800, smoothed: 4100 },
    { month: 'Feb', income: 3800, expenses: 2600, smoothed: 4050 },
    { month: 'Mar', income: 5200, expenses: 3200, smoothed: 4200 },
    { month: 'Apr', income: 3600, expenses: 2900, smoothed: 4150 },
    { month: 'May', income: 4800, expenses: 3100, smoothed: 4250 },
    { month: 'Jun', income: 4400, expenses: 2700, smoothed: 4300 }
  ];

  metrics: Metrics = {
    totalIncome: 26000,
    totalExpenses: 17300,
    netSavings: 8700,
    savingsRate: 33.5,
    avgMonthlyIncome: 4333,
    smoothedIncome: 4342
  };

  categoryExpenses: CategoryExpense[] = [
    { name: 'Housing', value: 6500, color: '#3b82f6' },
    { name: 'Food', value: 3800, color: '#10b981' },
    { name: 'Transport', value: 2400, color: '#f59e0b' },
    { name: 'Entertainment', value: 1900, color: '#8b5cf6' },
    { name: 'Other', value: 2700, color: '#ec4899' }
  ];

  timeframes: string[] = ['1M', '3M', '6M', '1Y'];

  // Chart options for ngx-charts
  lineChartData: any[] = [];
  barChartData: any[] = [];
  
  colorScheme = {
    domain: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
  };

  ngOnInit(): void {
    this.prepareChartData();
  }

  prepareChartData(): void {
    // Prepare line chart data for income smoothing
    this.lineChartData = [
      {
        name: 'Actual Income',
        series: this.monthlyData.map(d => ({ name: d.month, value: d.income }))
      },
      {
        name: 'Smoothed',
        series: this.monthlyData.map(d => ({ name: d.month, value: d.smoothed }))
      }
    ];

    // Prepare bar chart data for income vs expenses
    this.barChartData = [
      {
        name: 'Income',
        series: this.monthlyData.map(d => ({ name: d.month, value: d.income }))
      },
      {
        name: 'Expenses',
        series: this.monthlyData.map(d => ({ name: d.month, value: d.expenses }))
      }
    ];
  }

  setTimeframe(tf: string): void {
    this.timeframe = tf;
    // Add logic to fetch data based on timeframe
  }

  getPercentage(value: number): number {
    return (value / this.metrics.totalExpenses) * 100;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString();
  }
}