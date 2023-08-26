import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/types';
import { DatabaseService } from '../databaseFactory/dbPool';
import { v4 as uniqueId } from 'uuid';
import { IUser } from './type';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async getUser([key,value]: [string, string]): Promise<IUser | null> {
    const query = `
      SELECT * FROM users
      WHERE ${key} = $1;
    `;
    const response = await this.databaseService.query(query, [value]);
    return response.rows[0] || null;
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
