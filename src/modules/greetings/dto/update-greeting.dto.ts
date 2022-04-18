import { PartialType } from '@nestjs/swagger';
import { CreateGreetingDto } from './create-greeting.dto';

export class UpdateGreetingDto extends PartialType(CreateGreetingDto) {}
