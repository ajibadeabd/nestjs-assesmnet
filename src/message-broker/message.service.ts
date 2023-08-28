import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
@Injectable()
export class BrokerService {
  constructor(
    @Inject('BROKER_SERVICES_CLIENT')
    private RmqService: ClientRMQ,
  ) {}

  async processBilling(data) {
    console.log('fire');
    this.RmqService.emit('calculate_billing', JSON.stringify(data));
  }
}
