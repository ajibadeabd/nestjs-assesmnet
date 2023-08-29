import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { BrokerService } from './message.service';
import { BrokerController } from './message.controller';
import { DatabaseModule } from '../databaseFactory/database.module';
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
    DatabaseModule,
  ],
  controllers: [BrokerController],
  providers: [BrokerService],
  exports: [BrokerService],
})
export class BrokerModule {}
