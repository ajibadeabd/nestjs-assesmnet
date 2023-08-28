import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { BrokerService } from './message.service';
import { BrokerController } from './message.controller';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BROKER_SERVICES_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_HOSTS],
          queue: 'salla_billing_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [BrokerController],
  providers: [BrokerService],
  exports: [BrokerService],
})
export class BrokerModule {}
