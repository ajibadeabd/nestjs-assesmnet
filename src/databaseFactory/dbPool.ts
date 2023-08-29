import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly pool: Pool;
  private poolClient: PoolClient;

  constructor(private readonly configService: ConfigService) {
    this.pool = new Pool({
      user: this.configService.get<string>('DB_USER', 'postgres'),
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      database: this.configService.get<string>('DB_NAME', 'mydb'),
      password: this.configService.get<string>('DB_PASSWORD', 'password'),
      port: this.configService.get<number>('DB_PORT', 5432),
      ssl: {
        rejectUnauthorized: false, // Set to true if you have the proper SSL certificates
      },
    });
  }

  async onModuleInit() {
    try {
      this.poolClient = await this.pool.connect();
      console.log('Database connection established');
    } catch (error) {
      console.error('Error establishing database connection:', error);
    }
  }

  async query(sql: string, params?: any[]): Promise<any> {
    return await this.poolClient.query(sql, params);
  }
  async closePool(): Promise<void> {
    await this.poolClient.release();
    await this.pool.end();
  }
}
