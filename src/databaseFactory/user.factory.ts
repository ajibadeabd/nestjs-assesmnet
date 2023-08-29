import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/types';
import { DatabaseService } from './dbPool';
import { IUser } from 'src/user/type';
// import { IUser } from './type';

@Injectable()
export class UserDataFactory {
  constructor(private databaseService: DatabaseService) {}

  async getUser(
    queryParameters: { [key: string]: string },
    excludeProperties = false,
    subscriptions = false,
  ): Promise<IUser | null> {
    const select = excludeProperties
      ? 'users.id, name, email, users.created_at, users.updated_at'
      : 'users.*';

    const keys = Object.keys(queryParameters);
    const conditions = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');
    const values = keys.map((key) => queryParameters[key]);

    let query = `
      SELECT ${select}
      FROM users
      WHERE ${conditions};
      
    `;
    if (subscriptions) {
      query = `
              SELECT users.*,
              (
              SELECT json_agg(subscriptions)
              FROM subscriptions
              WHERE subscriptions.user_id = users.id
              ) AS subscriptions
              FROM users
              LEFT JOIN subscriptions ON users.id = subscriptions.user_id
              WHERE users.id = $1
              GROUP BY users.id;
              `;
    }
    const response = await this.databaseService.query(query, values);
    return response.rows[0];
  }

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const query = `
    INSERT INTO users ( name, email, password, updated_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, updated_at;
  `;
    const values = [
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
      new Date(),
    ];
    try {
      const response = await this.databaseService.query(query, values);
      return response.rows[0];
    } catch (error) {
      throw error;
    }
  }
  async updateUserDetails(planId: string, email: string) {
    try {
      const query = `
    UPDATE users
    SET plan_id = $1, updated_at = $2
    WHERE email = $3
    RETURNING id;
  `;
      const values = [planId, new Date(), email];
      const response = await this.databaseService.query(query, values);
      return response.rows[0];
    } catch (error) {}
  }
}
