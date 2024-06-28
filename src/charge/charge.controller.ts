import {
  Controller,
  Get,
  Post,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';

@Controller('charges')
export class ChargesController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('list/:customerId')
  async listAllChargesForCustomer(@Param('customerId') customerId: string) {
    try {
      const charges =
        await this.stripeService.listAllChargesForCustomer(customerId);
      return charges;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('refund/:chargeId')
  async issueRefundForCharge(@Param('chargeId') chargeId: string) {
    try {
      const refund = await this.stripeService.issueRefundForCharge(chargeId);
      return refund;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
