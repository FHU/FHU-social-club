export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  relationshipStatus?: string;
  classification: string;
  email: string;
  phone: string;
  showEmail: boolean;
  showPhone: boolean;
  imageURL: string;
  officer?: string;
}
