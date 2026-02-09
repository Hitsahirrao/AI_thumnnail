export interface IPricing {
  id?: string;
  name: string;
  price: number;
  features: string[];
  cta?: string;
  isPopular?: boolean;
}
