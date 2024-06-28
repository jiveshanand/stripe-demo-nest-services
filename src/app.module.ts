import { Module } from '@nestjs/common';
import { StripeService } from './stripe/stripe.service';
import { CustomersController } from './customers/customers.controller';
import { PaymentsController } from './payments/payments.controller';
import { SubscriptionsController } from './subscription/subscription.controller';
import { ChargesController } from './charge/charge.controller';

@Module({
  imports: [],
  controllers: [
    CustomersController,
    PaymentsController,
    SubscriptionsController,
    ChargesController,
  ],
  providers: [StripeService],
})
export class AppModule {}
