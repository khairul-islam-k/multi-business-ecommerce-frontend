import { type Dayjs } from "dayjs";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type EditProfileFormValues = {
  id?: string;
  name: string;
  phone?: string;
  profile: {
    id?: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    dateOfBirth?: Dayjs;
    gender?: Gender;
    address?: string;
    city?: string;
    country?: string;
    bio?: string;
    deletedAt?: string | null;
    updatedAt?: string | null;
    createdAt?: string ;
  };
};