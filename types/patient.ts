export type Patient = {
  id: string;
  uuid: string;
  name: string;
  email: string;
  location: string;
  flag: string;
  status: 'Active' | 'Inactive' | 'Pending';
  balance: number;
};