import { Injectable } from '@nestjs/common';
import { Greeting, Prisma } from '@prisma/client';
import { RecordNotFoundException } from 'src/common/exceptions/record-not-found.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GreetingsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.GreetingCreateInput): Promise<Greeting> {
    return this.prisma.greeting.create({ data });
  }

  findAll(): Promise<Greeting[]> {
    return this.prisma.greeting.findMany();
  }

  async findOne(id: number): Promise<Greeting> {
    const greeting = await this.prisma.greeting.findUnique({ where: { id } });

    if (!greeting) {
      throw new RecordNotFoundException();
    }

    return greeting;
  }

  async update(
    id: number,
    data: Prisma.GreetingUpdateInput,
  ): Promise<Greeting> {
    return this.prisma.greeting.update({
      data,
      where: { id },
    });
  }

  remove(id: number): Promise<Greeting> {
    return this.prisma.greeting.delete({ where: { id } });
  }
}
