export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

// Extended transaction data for comprehensive testing (Nigerian context)
export const mockTransactions: Transaction[] = [
  // Recent transactions
  { id: '1', description: 'ShopRite Lagos', amount: 45850, category: 'Food & Dining', date: '2024-02-01', type: 'expense' },
  { id: '2', description: 'Oando Filling Station', amount: 18500, category: 'Transportation', date: '2024-01-31', type: 'expense' },
  { id: '3', description: 'Jumia Online Shopping', amount: 32750, category: 'Shopping', date: '2024-01-30', type: 'expense' },
  { id: '4', description: 'EKEDC Electric Bill', amount: 28500, category: 'Bills & Utilities', date: '2024-01-29', type: 'expense' },
  { id: '5', description: 'Silverbird Cinema', amount: 12500, category: 'Entertainment', date: '2024-01-28', type: 'expense' },
  
  // More historical data
  { id: '6', description: 'Salary Deposit', amount: 1250000, category: 'Income', date: '2024-01-15', type: 'income' },
  { id: '7', description: 'Terra Kulture Restaurant', amount: 25800, category: 'Food & Dining', date: '2024-01-27', type: 'expense' },
  { id: '8', description: 'Cafe Neo', amount: 3500, category: 'Food & Dining', date: '2024-01-26', type: 'expense' },
  { id: '9', description: 'Bolt Ride', amount: 6250, category: 'Transportation', date: '2024-01-25', type: 'expense' },
  { id: '10', description: 'Medplus Pharmacy', amount: 12850, category: 'Healthcare', date: '2024-01-24', type: 'expense' },
  
  // Additional transactions for better data variety
  { id: '11', description: 'Freelance Project Payment', amount: 320000, category: 'Income', date: '2024-01-20', type: 'income' },
  { id: '12', description: 'MTN Internet Bill', amount: 25000, category: 'Bills & Utilities', date: '2024-01-23', type: 'expense' },
  { id: '13', description: 'Polo Park Mall Shopping', amount: 48750, category: 'Shopping', date: '2024-01-22', type: 'expense' },
  { id: '14', description: 'The Gym Lagos', amount: 15000, category: 'Healthcare', date: '2024-01-21', type: 'expense' },
  { id: '15', description: 'CSS Bookstore', amount: 8500, category: 'Shopping', date: '2024-01-19', type: 'expense' },
  
  { id: '16', description: 'Mr. Biggs', amount: 4250, category: 'Food & Dining', date: '2024-01-18', type: 'expense' },
  { id: '17', description: 'VI Parking Fee', amount: 3000, category: 'Transportation', date: '2024-01-17', type: 'expense' },
  { id: '18', description: 'Netflix Subscription', amount: 5500, category: 'Entertainment', date: '2024-01-16', type: 'expense' },
  { id: '19', description: 'Airtel Phone Bill', amount: 22000, category: 'Bills & Utilities', date: '2024-01-15', type: 'expense' },
  { id: '20', description: 'Shoprite Ikeja', amount: 38750, category: 'Food & Dining', date: '2024-01-14', type: 'expense' },
  
  // Older transactions
  { id: '21', description: 'December Salary', amount: 1250000, category: 'Income', date: '2023-12-15', type: 'income' },
  { id: '22', description: 'Christmas Shopping - Palms Mall', amount: 95500, category: 'Shopping', date: '2023-12-20', type: 'expense' },
  { id: '23', description: 'Car Service - Toyota Nigeria', amount: 72500, category: 'Transportation', date: '2023-12-18', type: 'expense' },
  { id: '24', description: 'Lagos University Teaching Hospital', amount: 28000, category: 'Healthcare', date: '2023-12-12', type: 'expense' },
  { id: '25', description: 'Davido Concert Tickets', amount: 35000, category: 'Entertainment', date: '2023-12-10', type: 'expense' },
  
  // Additional variety
  { id: '26', description: 'Apartment Rent - Lagos', amount: 450000, category: 'Bills & Utilities', date: '2024-01-01', type: 'expense' },
  { id: '27', description: 'Tutoring Payment', amount: 75000, category: 'Income', date: '2024-01-05', type: 'income' },
  { id: '28', description: 'Ebeano Supermarket', amount: 19850, category: 'Shopping', date: '2024-01-08', type: 'expense' },
  { id: '29', description: 'Business Lunch - Eko Hotel', amount: 14200, category: 'Food & Dining', date: '2024-01-10', type: 'expense' },
  { id: '30', description: 'Danfo Bus Fare', amount: 2000, category: 'Transportation', date: '2024-01-12', type: 'expense' },
];

export const mockCategoryData: CategoryData[] = [
  { category: 'Food & Dining', amount: 185750, color: '#ff6b6b' },
  { category: 'Shopping', amount: 125500, color: '#4ecdc4' },
  { category: 'Transportation', amount: 108250, color: '#45b7d1' },
  { category: 'Bills & Utilities', amount: 295000, color: '#96ceb4' },
  { category: 'Entertainment', amount: 58500, color: '#ffeaa7' },
  { category: 'Healthcare', amount: 32850, color: '#dda0dd' },
];