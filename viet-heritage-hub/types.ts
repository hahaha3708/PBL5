export enum RoutePath {
  HOME = '/',
  HISTORY = '/history',
  MAP = '/map',
  AI = '/ai',
  COMMUNITY = '/community',
  MARKETPLACE = '/marketplace'
}

export interface NavItem {
  label: string;
  path: RoutePath;
  icon: string;
}

export interface Dynasty {
  id: string;
  name: string;
  period: string;
  description: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  artisan: string;
  price: number;
  image: string;
  category: string;
}

export interface HistoricalEvent {
  year: number;
  title: string;
  description: string;
  type: 'war' | 'culture' | 'politics';
}
