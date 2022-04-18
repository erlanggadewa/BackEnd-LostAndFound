import { NotFoundException } from '@nestjs/common';

export class RecordNotFoundException extends NotFoundException {
  constructor() {
    super('Record not found');
  }
}
