import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/types';
import { DatabaseService } from './dbPool';
import { v4 as uniqueId } from 'uuid';
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
    INSERT INTO users (id, name, email, password, updated_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, created_at, updated_at;
  `;
    const values = [
      uniqueId(),
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
}
