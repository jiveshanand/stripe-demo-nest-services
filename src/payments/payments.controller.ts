import {
  Body,
  Controller,
  Post,
  Param,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { CreateAndCapturePaymentIntentDto } from './dtos/create-and-capture-payment-intent.dto';
import { CreatePaymentIntentForDifferentPaymentMethodsDto } from './dtos/create-payment-intent-for-different-payment-methods.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-intent')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPaymentIntent(
    @Body()
    body: {
      amount: number;
      currency: string;
      paymentMethodId: string;
      customerId: string;
    },
  ) {
    try {
      const { amount, currency, paymentMethodId, customerId } = body;
      const paymentIntent = await this.stripeService.createPaymentIntent(
        amount,
        currency,
        paymentMethodId,
        customerId,
      );
      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('capture/:paymentIntentId')
  async capturePayment(@Param('paymentIntentId') paymentIntentId: string) {
    try {
      const paymentIntent =
        await this.stripeService.capturePayment(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('create-method')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPaymentMethod(@Body() paymentMethodDto: any) {
    try {
      const paymentMethod =
        await this.stripeService.createPaymentMethod(paymentMethodDto);
      return paymentMethod;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('attach-method')
  @UsePipes(new ValidationPipe({ transform: true }))
  async attachPaymentMethod(
    @Body() body: { customerId: string; paymentMethodId: string },
  ) {
    try {
      const { customerId, paymentMethodId } = body;
      const paymentMethod = await this.stripeService.attachPaymentMethod(
        customerId,
        paymentMethodId,
      );
      return paymentMethod;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('confirm-intent')
  @UsePipes(new ValidationPipe({ transform: true }))
  async confirmPaymentIntent(
    @Body()
    body: {
      paymentIntentId: string;
      paymentMethod: string;
      returnUrl: string;
    },
  ) {
    try {
      const { paymentIntentId, paymentMethod, returnUrl } = body;
      const paymentIntent = await this.stripeService.confirmPaymentIntent(
        paymentIntentId,
        paymentMethod,
        returnUrl,
      );
      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('create-and-capture-intent')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createAndCapturePaymentIntent(
    @Body() createAndCapturePaymentIntentDto: CreateAndCapturePaymentIntentDto,
  ) {
    try {
      const { amount, currency, customerId, paymentMethodId } =
        createAndCapturePaymentIntentDto;
      const paymentIntent =
        await this.stripeService.createAndCapturePaymentIntent(
          amount,
          currency,
          customerId,
          paymentMethodId,
        );
      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('create-payment-intends-payment-methods')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPaymentIntentForDifferentPaymentMethods(
    @Body()
    createPaymentIntentForDifferentPaymentMethodsDto: CreatePaymentIntentForDifferentPaymentMethodsDto,
  ) {
    try {
      const { customerId } = createPaymentIntentForDifferentPaymentMethodsDto;
      const clientSecret =
        await this.stripeService.createPaymentIntentForDifferentPaymentMethods(
          customerId,
        );
      return { clientSecret };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
