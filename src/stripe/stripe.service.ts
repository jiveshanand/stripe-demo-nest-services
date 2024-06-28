import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      'sk_test_51PRH4lK28JpGLXfjX7MgGEXobSH8OmAfxnUSwMHv74ukDhwwYO1tgqnFRsGGPnwq6xbD35BfaDhE2dR6QxTfI3TL003cn9FkwB',
    );
  }

  async createCustomer(customerInfo: {
    customerName: string;
    customerEmail: string;
  }) {
    try {
      const customer = await this.stripe.customers.create({
        name: customerInfo.customerName,
        email: customerInfo.customerEmail,
      });
      return customer;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to create customer',
        error.message,
      );
    }
  }

  async getCustomerList(): Promise<Stripe.ApiList<Stripe.Customer>> {
    try {
      return await this.stripe.customers.list({ limit: 10 });
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to get customer list',
        error.message,
      );
    }
  }

  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    try {
      return await this.stripe.setupIntents.create({ customer: customerId });
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to create setup intent',
        error.message,
      );
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    paymentMethodId: string,
    customerId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.create({
        amount,
        currency,
        payment_method: paymentMethodId,
        customer: customerId,
        capture_method: 'manual',
      });
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to create payment intent',
        error.message,
      );
    }
  }

  async capturePayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.capture(paymentIntentId);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to capture payment',
        error.message,
      );
    }
  }

  async createPaymentMethod(
    paymentMethodDto: any,
  ): Promise<Stripe.PaymentMethod> {
    try {
      return await this.stripe.paymentMethods.create(paymentMethodDto);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to create payment method',
        error.message,
      );
    }
  }

  async attachPaymentMethod(customerId: string, paymentMethodId: string) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(
        paymentMethodId,
        { customer: customerId },
      );
      await this.stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      return paymentMethod;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to attach payment method',
        error.message,
      );
    }
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethod: string,
    returnUrl: string,
  ) {
    try {
      const paymentIntentConfirmResponse =
        await this.stripe.paymentIntents.confirm(paymentIntentId, {
          payment_method: paymentMethod,
          return_url: returnUrl,
        });
      return paymentIntentConfirmResponse;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to confirm payment intent',
        error.message,
      );
    }
  }

  async createAndCapturePaymentIntent(
    amount: number,
    currency: string,
    customerId: string,
    paymentMethodId: string,
  ) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        capture_method: 'automatic',
      });
      return paymentIntent;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to create and capture payment intent',
        error.message,
      );
    }
  }

  async listAllChargesForCustomer(customerId: string) {
    try {
      const charges = await this.stripe.charges.list({
        limit: 3,
        customer: customerId,
      });
      return charges;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to list all charges for customer',
        error.message,
      );
    }
  }

  async issueRefundForCharge(chargeId: string) {
    try {
      const refund = await this.stripe.refunds.create({
        charge: chargeId,
      });
      return refund;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to issue refund for charge',
        error.message,
      );
    }
  }

  async createPaymentIntentForDifferentPaymentMethods(customerId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 5000,
        currency: 'usd',
        customer: customerId,
        payment_method_types: [
          'card',
          'acss_debit',
          'link',
          'cashapp',
          'affirm',
        ],
      });

      return paymentIntent.client_secret;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to create payment intent for different payment methods',
        error.message,
      );
    }
  }

  async createCheckoutSession(customerId: string) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: [
          'card',
          // 'ach_credit_transfer',
          'cashapp',
        ],
        mode: 'subscription',
        customer: customerId,
        line_items: [
          {
            price: 'price_1PS6NvK28JpGLXfjgbgZrjwI',
            quantity: 1,
          },
        ],
        success_url: 'http://localhost:3001/success',
        cancel_url: 'http://localhost:3001/cancel',
      });

      return session.url;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to create checkout session',
        error.message,
      );
    }
  }

  async updateSubscription(
    subscriptionId: string,
    anchorDate: Stripe.SubscriptionUpdateParams.BillingCycleAnchor,
  ) {
    try {
      const subscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          billing_cycle_anchor: anchorDate,
          proration_behavior: 'create_prorations',
        },
      );

      return subscription;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'Failed to update subscription',
        error.message,
      );
    }
  }
}
