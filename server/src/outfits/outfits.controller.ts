import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import {
  CreateOutfitSchema,
  SurpriseQuerySchema,
  UpdateOutfitSchema,
  type CreateOutfitDto,
  type SurpriseQueryDto,
  type UpdateOutfitDto,
} from "@styled/shared";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { UserId } from "../auth/user-id.decorator.js";
import { ParseIdPipe } from "../common/pipes/parse-id.pipe.js";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe.js";
import { OutfitsService } from "./outfits.service.js";

@Controller("api/outfits")
@UseGuards(JwtAuthGuard)
export class OutfitsController {
  constructor(private readonly outfits: OutfitsService) {}

  // CREATE: POST /api/outfits
  @Post()
  async create(
    @UserId() userId: number,
    @Body(new ZodValidationPipe(CreateOutfitSchema)) dto: CreateOutfitDto
  ) {
    return { outfit: await this.outfits.create(userId, dto) };
  }

  // READ ALL: GET /api/outfits
  @Get()
  async findAll(@UserId() userId: number) {
    return { outfits: await this.outfits.findAll(userId) };
  }

  // SURPRISE ME: GET /api/outfits/surprise?season=WINTER
  // Must stay ABOVE @Get(":id"): Nest registers routes in the order they are declared,
  // otherwise "/surprise" would match ":id" (→ 400 "Invalid outfit id")
  @Get("surprise")
  async surprise(
    @UserId() userId: number,
    @Query(new ZodValidationPipe(SurpriseQuerySchema)) query: SurpriseQueryDto
  ) {
    return { items: await this.outfits.surprise(userId, query) };
  }

  // READ ONE: GET /api/outfits/:id
  @Get(":id")
  async findOne(@UserId() userId: number, @Param("id", new ParseIdPipe("outfit")) id: number) {
    return { outfit: await this.outfits.findOne(userId, id) };
  }

  // UPDATE: PATCH /api/outfits/:id
  // Parameter order matters: Nest runs the parameter pipes from the LAST parameter to the first,
  // so the id is declared after the body to be checked first (bad id + bad body → "Invalid outfit id", like Express)
  @Patch(":id")
  async update(
    @Body(new ZodValidationPipe(UpdateOutfitSchema)) dto: UpdateOutfitDto,
    @Param("id", new ParseIdPipe("outfit")) id: number,
    @UserId() userId: number
  ) {
    return { outfit: await this.outfits.update(userId, id, dto) };
  }

  // DELETE: DELETE /api/outfits/:id → 204 with an empty body
  @Delete(":id")
  @HttpCode(204)
  async remove(@UserId() userId: number, @Param("id", new ParseIdPipe("outfit")) id: number) {
    await this.outfits.remove(userId, id);
  }
}
