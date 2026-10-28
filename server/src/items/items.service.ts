import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateItemDto, ItemFilters, UpdateItemDto } from "@styled/shared";
import type { Prisma } from "../../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { stripUndefined } from "../common/utils/strip-undefined.js";

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, dto: CreateItemDto) {
    return this.prisma.clothingItem.create({
      data: { ...dto, userId },
    });
  }

  findAll(userId: number, { category, style, color, season, search }: ItemFilters) {
    // Always limited to the logged-in user's items
    const where: Prisma.ClothingItemWhereInput = { userId };

    // Add each filter only if it was sent
    if (category) where.category = category;
    if (style) where.styles = { has: style };
    if (color) where.colors = { has: color };
    if (season) where.seasons = { has: season };
    if (search) where.name = { contains: search, mode: "insensitive" };

    return this.prisma.clothingItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async update(userId: number, id: number, dto: UpdateItemDto) {
    await this.findOwned(userId, id);

    return this.prisma.clothingItem.update({
      where: { id },
      data: stripUndefined(dto),
    });
  }

  async remove(userId: number, id: number) {
    await this.findOwned(userId, id);
    await this.prisma.clothingItem.delete({ where: { id } });
  }

  // Ownership check: another user's item gets the same 404 as a missing one
  private async findOwned(userId: number, id: number) {
    const item = await this.prisma.clothingItem.findFirst({
      where: { id, userId },
    });

    if (!item) {
      throw new NotFoundException("Item not found");
    }

    return item;
  }
}
