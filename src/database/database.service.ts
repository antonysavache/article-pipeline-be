import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    try {
      if (this.dataSource.isInitialized) {
        console.log('Database connection established successfully');
        await this.testConnection();
      }
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }

  getClient(): DataSource {
    return this.dataSource;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      console.log('Database connection test passed');
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}
