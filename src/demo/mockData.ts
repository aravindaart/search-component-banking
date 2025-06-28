import { SearchableItem } from '../types/search.types';

/**
 * Mock Banking Data for Demo
 * Realistic banking entities for testing the Smart Search component
 */
export const mockBankingData: SearchableItem[] = [
  // Premium Accounts
  {
    id: 'acc-001',
    title: 'Premium Savings Account',
    subtitle: 'Account Number: ****1234',
    description: 'High-yield savings account with premium benefits',
    category: 'account',
    status: 'active',
    amount: 125000.50,
    currency: 'USD',
    createdAt: '2024-01-15T10:30:00Z',
    priority: 10,
    metadata: { 
      accountType: 'savings', 
      branch: 'Fifth Avenue',
      interestRate: 2.5 
    }
  },
  {
    id: 'acc-002',
    title: 'Business Checking Account',
    subtitle: 'Account Number: ****5678',
    description: 'Corporate checking account with advanced features',
    category: 'account',
    status: 'active',
    amount: 250000.00,
    currency: 'USD',
    createdAt: '2023-11-20T14:15:00Z',
    priority: 8,
    metadata: { 
      accountType: 'checking', 
      branch: 'Wall Street',
      businessType: 'LLC'
    }
  },
  {
    id: 'acc-003',
    title: 'Investment Portfolio Account',
    subtitle: 'Portfolio ID: INV-9876',
    description: 'Diversified investment portfolio management',
    category: 'investment',
    status: 'active',
    amount: 750000.00,
    currency: 'USD',
    createdAt: '2024-02-01T09:00:00Z',
    priority: 9,
    metadata: { 
      portfolioType: 'diversified',
      riskLevel: 'moderate',
      manager: 'Sarah Johnson'
    }
  },

  // Recent Transactions
  {
    id: 'txn-001',
    title: 'Wire Transfer to Global Investments LLC',
    subtitle: 'Dec 15, 2024 • 2:30 PM',
    description: 'International wire transfer for investment purposes',
    category: 'transaction',
    status: 'completed',
    amount: -50000.00,
    currency: 'USD',
    createdAt: '2024-12-15T14:30:00Z',
    priority: 7,
    metadata: { 
      type: 'wire', 
      reference: 'WT2024001',
      recipient: 'Global Investments LLC',
      country: 'Switzerland'
    }
  },
  {
    id: 'txn-002',
    title: 'Dividend Payment from Apple Inc.',
    subtitle: 'Dec 14, 2024 • 9:00 AM',
    description: 'Quarterly dividend payment from AAPL holdings',
    category: 'transaction',
    status: 'completed',
    amount: 2500.00,
    currency: 'USD',
    createdAt: '2024-12-14T09:00:00Z',
    priority: 5,
    metadata: { 
      type: 'dividend',
      symbol: 'AAPL',
      shares: 1000,
      perShare: 2.50
    }
  },
  {
    id: 'txn-003',
    title: 'ATM Withdrawal',
    subtitle: 'Dec 13, 2024 • 6:45 PM',
    description: 'Cash withdrawal from ATM #5547 Fifth Avenue',
    category: 'transaction',
    status: 'completed',
    amount: -500.00,
    currency: 'USD',
    createdAt: '2024-12-13T18:45:00Z',
    priority: 2,
    metadata: { 
      type: 'atm',
      location: 'Fifth Avenue ATM #5547',
      fee: 0
    }
  },
  {
    id: 'txn-004',
    title: 'Credit Card Payment',
    subtitle: 'Dec 12, 2024 • 11:20 AM',
    description: 'Monthly credit card payment for Platinum Card',
    category: 'transaction',
    status: 'pending',
    amount: -3200.00,
    currency: 'USD',
    createdAt: '2024-12-12T11:20:00Z',
    priority: 6,
    metadata: { 
      type: 'payment',
      cardType: 'platinum',
      dueDate: '2024-12-15'
    }
  },

  // Premium Customers
  {
    id: 'cust-001',
    title: 'Sarah Johnson',
    subtitle: 'Premium Banking Client',
    description: 'Private wealth management client since 2019',
    category: 'customer',
    status: 'active',
    createdAt: '2019-03-15T10:00:00Z',
    priority: 9,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b90a14c1?w=150&h=150&fit=crop&crop=face',
    metadata: { 
      segment: 'premium',
      relationship: '5 years',
      advisor: 'Michael Chen',
      totalAssets: 1250000
    }
  },
  {
    id: 'cust-002',
    title: 'Robert Chen',
    subtitle: 'Corporate Banking Client',
    description: 'CEO of Tech Innovations Inc., corporate client',
    category: 'customer',
    status: 'active',
    createdAt: '2020-07-22T14:30:00Z',
    priority: 8,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    metadata: { 
      segment: 'corporate',
      company: 'Tech Innovations Inc.',
      industry: 'Technology',
      employees: 250
    }
  },
  {
    id: 'cust-003',
    title: 'Emily Rodriguez',
    subtitle: 'Investment Advisory Client',
    description: 'High-net-worth individual, investment focus',
    category: 'customer',
    status: 'active',
    createdAt: '2021-01-10T16:45:00Z',
    priority: 7,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    metadata: { 
      segment: 'investment',
      riskTolerance: 'aggressive',
      portfolioValue: 850000
    }
  },

  // Credit Cards
  {
    id: 'card-001',
    title: 'Platinum Rewards Credit Card',
    subtitle: 'Card ending in 1234',
    description: 'Premium rewards card with travel benefits',
    category: 'card',
    status: 'active',
    amount: -3200.00, // Current balance
    currency: 'USD',
    createdAt: '2023-06-15T12:00:00Z',
    priority: 6,
    metadata: { 
      cardType: 'platinum',
      creditLimit: 50000,
      rewardsPoints: 125000,
      annualFee: 550
    }
  },
  {
    id: 'card-002',
    title: 'Business Corporate Card',
    subtitle: 'Card ending in 5678',
    description: 'Corporate card for business expenses',
    category: 'card',
    status: 'active',
    amount: -8750.00,
    currency: 'USD',
    createdAt: '2023-09-01T09:30:00Z',
    priority: 5,
    metadata: { 
      cardType: 'corporate',
      creditLimit: 100000,
      category: 'business',
      monthlySpend: 15000
    }
  },
  {
    id: 'card-003',
    title: 'Travel Elite Credit Card',
    subtitle: 'Card ending in 9012',
    description: 'Premium travel card with lounge access',
    category: 'card',
    status: 'inactive',
    amount: 0,
    currency: 'USD',
    createdAt: '2022-03-20T11:15:00Z',
    priority: 3,
    metadata: { 
      cardType: 'travel',
      creditLimit: 25000,
      status: 'cancelled',
      lastUsed: '2024-06-15'
    }
  },

  // Investment Products
  {
    id: 'inv-001',
    title: 'Growth Equity Fund',
    subtitle: 'Fund ID: GEF-2024',
    description: 'Diversified growth equity investment fund',
    category: 'investment',
    status: 'active',
    amount: 185000.00,
    currency: 'USD',
    createdAt: '2024-03-01T10:00:00Z',
    priority: 8,
    metadata: { 
      fundType: 'equity',
      performance: '+12.5%',
      riskRating: 'moderate-high',
      manager: 'Goldman Asset Management'
    }
  },
  {
    id: 'inv-002',
    title: 'Treasury Bond Portfolio',
    subtitle: 'Portfolio ID: TBP-2024',
    description: 'Conservative government bond investments',
    category: 'investment',
    status: 'active',
    amount: 95000.00,
    currency: 'USD',
    createdAt: '2024-01-20T15:30:00Z',
    priority: 4,
    metadata: { 
      bondType: 'treasury',
      maturity: '10-year',
      yield: '4.2%',
      rating: 'AAA'
    }
  },

  // Additional diverse entries for comprehensive testing
  {
    id: 'txn-005',
    title: 'Salary Deposit from Tech Corp',
    subtitle: 'Dec 1, 2024 • 12:01 AM',
    description: 'Monthly salary deposit via direct transfer',
    category: 'transaction',
    status: 'completed',
    amount: 12500.00,
    currency: 'USD',
    createdAt: '2024-12-01T00:01:00Z',
    priority: 3,
    metadata: { 
      type: 'salary',
      employer: 'Tech Corp',
      payPeriod: 'monthly'
    }
  },
  {
    id: 'cust-004',
    title: 'David Kim',
    subtitle: 'Private Banking Client',
    description: 'Entrepreneur and angel investor',
    category: 'customer',
    status: 'active',
    createdAt: '2022-08-30T13:20:00Z',
    priority: 6,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    metadata: { 
      segment: 'private',
      netWorth: 2500000,
      interests: ['startups', 'real estate']
    }
  },
  {
    id: 'acc-004',
    title: 'Money Market Account',
    subtitle: 'Account Number: ****7890',
    description: 'High-yield money market with check-writing privileges',
    category: 'account',
    status: 'active',
    amount: 75000.00,
    currency: 'USD',
    createdAt: '2023-12-05T16:10:00Z',
    priority: 5,
    metadata: { 
      accountType: 'money_market',
      minBalance: 10000,
      currentAPY: 3.8
    }
  }
];

