export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
}
