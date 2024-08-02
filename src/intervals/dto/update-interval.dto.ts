import { PartialType } from '@nestjs/mapped-types';
import { CreateIntervalDto } from './create-interval.dto';

export class UpdateIntervalDto extends PartialType(CreateIntervalDto) {}
