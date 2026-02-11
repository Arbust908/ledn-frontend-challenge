export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  id: string;
}

export interface User {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  id: string;
}

export const Currencies = ['ICS', 'GCS'] as const;
export type Currency = typeof Currencies[number];

export const Statuses = ['inProgress', 'completed', 'blocked'] as const;
export type Status = typeof Statuses[number];

export interface Transaction {
  id: string;
  user: User['id'];
  amount: number;
  currency: Currency;
  date: string;
  status: Status;
}

export interface ExchangeRate {
  rate: string; // From GSC to ICS
}

// @deprecate
export interface PlanetsResponse {
  planets: Planet[];
}

// @deprecate
export interface UsersResponse {
  users: User[];
}

// @deprecate
export interface TransactionsResponse {
  transactions: Transaction[];
}

// @deprecate Is it needed?
export interface TransactionFilters {
  status: string;
  currency: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  userSearch: string;
}
