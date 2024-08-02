import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { IntervalsService } from './intervals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateIntervalDto, UpdateIntervalDto } from './dto';

@Controller('intervals')
@UseGuards(JwtAuthGuard)
export class IntervalsController {
  constructor(private readonly intervalsService: IntervalsService) {}

  @Post()
  create(@Body() createIntervalDto: CreateIntervalDto) {
    return this.intervalsService.create(createIntervalDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.intervalsService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.intervalsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIntervalDto: UpdateIntervalDto,
  ) {
    return this.intervalsService.update(id, updateIntervalDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.intervalsService.remove(id);
  }
}
