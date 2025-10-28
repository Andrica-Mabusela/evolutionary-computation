import { Component, OnInit } from '@angular/core';

interface Tier {
  id: number;
  name: string;
  color: string;
  benefits: string[];
  creditLimit: number;
  rewards: string;
}

interface ExpenseAllocation {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  currentTier: number = 2;
  selectedTier: number = 2;
  userName: string = 'John Doe';

  tiers: Tier[] = [
    {
      id: 1,
      name: 'Tier 1',
      color: '#131010',
      benefits: [
        'Basic account access',
        'Standard transaction limits',
        'Email support',
        'Mobile banking app'
      ],
      creditLimit: 5000,
      rewards: 'None'
    },
    {
      id: 2,
      name: 'Tier 2',
      color: '#77021e',
      benefits: [
        'R15,000 credit limit',
        'Access to Absa Rewards',
        'Priority email support',
        '2% cashback on groceries',
        'Free monthly statements'
      ],
      creditLimit: 15000,
      rewards: 'Absa Rewards Basic'
    },
    {
      id: 3,
      name: 'Tier 3',
      color: '#DC0033',
      benefits: [
        'R35,000 credit limit',
        'Absa Rewards Premium',
        '24/7 phone support',
        '5% cashback on groceries',
        'Free international transfers (2/month)',
        'Travel insurance included'
      ],
      creditLimit: 35000,
      rewards: 'Absa Rewards Premium'
    },
    {
      id: 4,
      name: 'Tier 4',
      color: '#ff780f',
      benefits: [
        'R75,000 credit limit',
        'Absa Rewards Platinum',
        'Dedicated account manager',
        '10% cashback on all purchases',
        'Unlimited international transfers',
        'Comprehensive travel & life insurance',
        'Airport lounge access',
        'Exclusive investment opportunities'
      ],
      creditLimit: 75000,
      rewards: 'Absa Rewards Platinum'
    }
  ];

  expenseAllocation: ExpenseAllocation[] = [
    { category: 'Housing', amount: 12500, percentage: 35, color: '#DC0033', icon: 'fa-home' },
    { category: 'Food & Groceries', amount: 6800, percentage: 19, color: '#ff780f', icon: 'fa-utensils' },
    { category: 'Transportation', amount: 5200, percentage: 15, color: '#77021e', icon: 'fa-car' },
    { category: 'Entertainment', amount: 3900, percentage: 11, color: '#DC0033', icon: 'fa-film' },
    { category: 'Healthcare', amount: 2800, percentage: 8, color: '#ff780f', icon: 'fa-heart-pulse' },
    { category: 'Shopping', amount: 2500, percentage: 7, color: '#77021e', icon: 'fa-shopping-bag' },
    { category: 'Other', amount: 1800, percentage: 5, color: '#131010', icon: 'fa-ellipsis' }
  ];

  totalExpenses: number = 0;
  progressToNextTier: number = 65;
  amountToNextTier: number = 8500;

  ngOnInit(): void {
    this.calculateTotalExpenses();
  }

  calculateTotalExpenses(): void {
    this.totalExpenses = this.expenseAllocation.reduce((sum, item) => sum + item.amount, 0);
  }

  selectTier(tierId: number): void {
    this.selectedTier = tierId;
  }

  getCurrentTier(): Tier {
    return this.tiers[this.currentTier - 1];
  }

  getSelectedTier(): Tier {
    return this.tiers[this.selectedTier - 1];
  }

  getNextTier(): Tier | null {
    return this.currentTier < 4 ? this.tiers[this.currentTier] : null;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString();
  }

  createDoughnutPath(index: number, total: number, isHighlighted: boolean): string {
    const segmentAngle = 360 / total;
    const startAngle = index * segmentAngle - 90;
    const endAngle = startAngle + segmentAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const outerRadius = isHighlighted ? 85 : 80;
    const innerRadius = 50;
    
    const x1 = 100 + outerRadius * Math.cos(startRad);
    const y1 = 100 + outerRadius * Math.sin(startRad);
    const x2 = 100 + outerRadius * Math.cos(endRad);
    const y2 = 100 + outerRadius * Math.sin(endRad);
    const x3 = 100 + innerRadius * Math.cos(endRad);
    const y3 = 100 + innerRadius * Math.sin(endRad);
    const x4 = 100 + innerRadius * Math.cos(startRad);
    const y4 = 100 + innerRadius * Math.sin(startRad);
    
    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;
  }

  getTierLabelPosition(index: number): { x: number, y: number } {
    const angle = (index * 90 + 45 - 90) * Math.PI / 180;
    return {
      x: 100 + 95 * Math.cos(angle),
      y: 100 + 95 * Math.sin(angle)
    };
  }

  getProgressGradient(): string {
    const currentColor = this.getCurrentTier().color;
    const nextTier = this.getNextTier();
    const nextColor = nextTier ? nextTier.color : currentColor;
    return `linear-gradient(90deg, ${currentColor} 0%, ${nextColor} 100%)`;
  }

  upgradeTier(tierId: number): void {
    // Logic to upgrade tier
    console.log(`Upgrading to Tier ${tierId}`);
  }
}