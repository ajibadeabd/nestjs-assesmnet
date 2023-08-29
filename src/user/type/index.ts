export interface IUser {
  id: string;
  name: string;
  email: string;
  plan_id?: string;
  password?: string;
  created_at: Date;
  updated_at: Date;
}
