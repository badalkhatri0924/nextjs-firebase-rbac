import { Timestamp } from "firebase/firestore/lite";

export interface IUser {
  id?: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  password?: string;
  createdAt?: Date | Timestamp;
}
