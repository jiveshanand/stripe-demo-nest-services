// src/payments/dtos/create-and-capture-payment-intent.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAndCapturePaymentIntentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}
