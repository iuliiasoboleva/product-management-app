export interface Product {
    id: number;
    name: string;
    description: string;
    sku: string;
    cost: number;
    profile: {
      type: string;
      available: boolean;
      backlog: number | null;
      [key: string]: any;
    };
  }
  