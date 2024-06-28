import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { StripeService } from '../stripe/stripe.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const customer =
        await this.stripeService.createCustomer(createCustomerDto);
      return { customerId: customer.id };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  async getCustomerList() {
    try {
      const customers = await this.stripeService.getCustomerList();
      return customers;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('setup-intent/:customerId')
  async createSetupIntent(@Param('customerId') customerId: string) {
    try {
      const setupIntent =
        await this.stripeService.createSetupIntent(customerId);
      return setupIntent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
