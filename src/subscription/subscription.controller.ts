import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import Stripe from 'stripe';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('update')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSubscription(
    @Body()
    body: {
      subscriptionId: string;
      anchorDate: Stripe.SubscriptionUpdateParams.BillingCycleAnchor;
    },
  ) {
    try {
      const { subscriptionId, anchorDate } = body;
      const subscription = await this.stripeService.updateSubscription(
        subscriptionId,
        anchorDate,
      );
      return subscription;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
