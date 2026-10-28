import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import {
  CreateItemSchema,
  ItemFiltersSchema,
  UpdateItemSchema,
  type CreateItemDto,
  type ItemFilters,
  type UpdateItemDto,
} from "@styled/shared";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { UserId } from "../auth/user-id.decorator.js";
import { ParseIdPipe } from "../common/pipes/parse-id.pipe.js";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe.js";
import { ItemsService } from "./items.service.js";

// Every route in this controller requires a logged-in user
@Controller("api/items")
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly items: ItemsService) {}

  // CREATE: POST /api/items
  @Post()
  async create(
    @UserId() userId: number,
    @Body(new ZodValidationPipe(CreateItemSchema)) dto: CreateItemDto
  ) {
    return { item: await this.items.create(userId, dto) };
  }

  // READ ALL (with optional filters): GET /api/items?category=TOP&season=WINTER
  @Get()
  async findAll(
    @UserId() userId: number,
    @Query(new ZodValidationPipe(ItemFiltersSchema)) filters: ItemFilters
  ) {
    return { items: await this.items.findAll(userId, filters) };
  }

  // UPDATE: PATCH /api/items/:id
  // Parameter order matters: Nest runs the parameter pipes from the LAST parameter to the first,
  // so the id is declared after the body to be checked first (bad id + bad body → "Invalid item id", like Express)
  @Patch(":id")
  async update(
    @Body(new ZodValidationPipe(UpdateItemSchema)) dto: UpdateItemDto,
    @Param("id", new ParseIdPipe("item")) id: number,
    @UserId() userId: number
  ) {
    return { item: await this.items.update(userId, id, dto) };
  }

  // DELETE: DELETE /api/items/:id → 204 with an empty body
  @Delete(":id")
  @HttpCode(204)
  async remove(@UserId() userId: number, @Param("id", new ParseIdPipe("item")) id: number) {
    await this.items.remove(userId, id);
  }
}
