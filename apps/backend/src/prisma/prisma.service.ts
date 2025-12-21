import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { db } from '@repo/db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await db.$connect();
  }

  async onModuleDestroy() {
    await db.$disconnect();
  }

  get client() {
    return db;
  }
}
