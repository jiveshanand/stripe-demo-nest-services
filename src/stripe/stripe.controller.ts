import { Controller, Post, Body, Get } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-customer')
  async createCustomer(
    @Body('customerName') customerName: string,
    @Body('customerEmail') customerEmail: string,
  ) {
    const customerInfo = {
      customerName,
      customerEmail,
    };
    const customer = await this.stripeService.createCustomer(customerInfo);
    return { customerId: customer.id };
  }

  @Post('create-setup-intent')
  async createSetupIntent(@Body('customerId') customerId: string) {
    const setupIntent = await this.stripeService.createSetupIntent(customerId);
    return { clientSecret: setupIntent.client_secret };
  }

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body('amount') amount: number,
    @Body('currency') currency: string,
    @Body('paymentMethodId') paymentMethodId: string,
    @Body('customerId') customerId: string,
  ) {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      amount,
      currency,
      paymentMethodId,
      customerId,
    );
    return { paymentIntentId: paymentIntent.id };
  }

  @Post('capture-payment')
  async capturePayment(@Body('paymentIntentId') paymentIntentId: string) {
    const paymentIntent =
      await this.stripeService.capturePayment(paymentIntentId);
    console.log('paymentIntent', paymentIntent);
    return {};
  }

  @Get('customers')
  async getCustomerList() {
    const customers = await this.stripeService.getCustomerList();
    return { customers: customers?.data };
  }

  @Post('create-payment-method')
  async createPaymentMethod(
    @Body() paymentMethodDto: { type: string; card: any },
  ) {
    const paymentMethod =
      await this.stripeService.createPaymentMethod(paymentMethodDto);
    return { paymentMethod };
  }
}
