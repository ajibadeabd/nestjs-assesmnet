import { Injectable } from '@nestjs/common';
import { DatabaseService } from './dbPool';
import { PlanDto } from '../plan/types';

@Injectable()
export class PlanDataFactory {
  constructor(private readonly databaseService: DatabaseService) {}

  async createPlan(plans: PlanDto): Promise<any> {
    const query = `
      INSERT INTO plans(
        ${Object.keys(plans).join(', ')}
      )
      VALUES (${Object.keys(plans)
        .map((_, index) => `$${index + 1}`)
        .join(', ')})
      RETURNING *;
    `;
    const values = Object.entries(plans).map(([_, value]) => value);
    try {
      const response = await this.databaseService.query(query, values);
      return response.rows[0]; // Return the inserted plan data
    } catch (error) {
      throw error;
    }
  }
}
