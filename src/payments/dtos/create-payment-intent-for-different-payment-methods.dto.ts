import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePaymentIntentForDifferentPaymentMethodsDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;
}
