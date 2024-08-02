import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { BookRecommendationDto } from './dto/book-recommendation.dto';

@Controller('recommendations')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get('top-five')
  async getTopFiveBooks(): Promise<BookRecommendationDto[]> {
    return this.recommendationsService.getTopFiveBooks();
  }

  @Get('personalized')
  async getPersonalizedRecommendations(
    @Request() req,
  ): Promise<BookRecommendationDto[]> {
    return this.recommendationsService.getPersonalizedRecommendations(
      req.user.userId,
    );
  }

  @Get('admin/all-recommendations')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getAllRecommendations(): Promise<BookRecommendationDto[]> {
    return this.recommendationsService.getAllRecommendations();
  }
}
