import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './address.dto';
import { CanBeUndefined } from 'src/utils/can-be-undefined';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @CanBeUndefined()
  @Type(() => AddressDto)
  @IsObject()
  @ValidateNested()
  address?: AddressDto;
}
