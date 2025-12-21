import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async prismaConnectionCheck() {
    const result = await this.prisma.client.$queryRaw`SELECT 1`;
    return {
      status: 'Successfully connected to the database',
      db: result,
    };
  }
}
