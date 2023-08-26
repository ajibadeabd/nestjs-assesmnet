import { Injectable } from '@nestjs/common';

@Injectable()
export class PlansService {
  constructor( ) {}

  async getPlan(id: string) {
    // return this.planRepository.findOne(id, { relations: ['user'] });
  }
}