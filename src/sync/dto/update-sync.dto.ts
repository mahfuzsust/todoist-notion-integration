import { PartialType } from '@nestjs/swagger';
import { CreateSyncDto } from './create-sync.dto';

export class UpdateSyncDto extends PartialType(CreateSyncDto) {}
