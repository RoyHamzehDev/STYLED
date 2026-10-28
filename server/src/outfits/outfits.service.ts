import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { Category, CreateOutfitDto, SurpriseQueryDto, UpdateOutfitDto } from "@styled/shared";
import type { Prisma } from "../../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";

// Fetch the outfit's items through the join table
const outfitInclude = {
  clothingItems: { include: { clothingItem: true } },
} as const;

type OutfitWithItems = Prisma.OutfitGetPayload<{ include: typeof outfitInclude }>;

// Flatten { clothingItems: [{ clothingItem: {...} }] } into { items: [{...}] }
function toOutfitResponse(outfit: OutfitWithItems) {
  const { clothingItems, ...rest } = outfit;
  return { ...rest, items: clothingItems.map((link) => link.clothingItem) };
}

@Injectable()
export class OutfitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, { name, occasion, itemIds }: CreateOutfitDto) {
    await this.assertOwnsItems(userId, itemIds);

    // Create the outfit and its join rows in one query (nested create)
    const outfit = await this.prisma.outfit.create({
      data: {
        name,
        occasion: occasion ?? null,
        userId,
        clothingItems: {
          create: itemIds.map((clothingItemId) => ({ clothingItemId })),
        },
      },
      include: outfitInclude,
    });

    return toOutfitResponse(outfit);
  }

  async findAll(userId: number) {
    const outfits = await this.prisma.outfit.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: outfitInclude,
    });

    return outfits.map(toOutfitResponse);
  }

  // Random unsaved suggestion: [outerwear?, top, bottom, footwear?]
  async surprise(userId: number, { season }: SurpriseQueryDto) {
    const where: Prisma.ClothingItemWhereInput = { userId };
    if (season) where.seasons = { has: season };

    const items = await this.prisma.clothingItem.findMany({ where });

    // Category type: a typo like "TOPS" is a compile-time error
    function pickRandom(category: Category) {
      const options = items.filter((item) => item.category === category);
      if (options.length === 0) return null;
      return options[Math.floor(Math.random() * options.length)] ?? null;
    }

    const top = pickRandom("TOP");
    const bottom = pickRandom("BOTTOM");

    if (!top || !bottom) {
      throw new BadRequestException("Add at least one top and one bottom to use Surprise Me");
    }

    return [pickRandom("OUTERWEAR"), top, bottom, pickRandom("FOOTWEAR")].filter(
      (item) => item !== null
    );
  }

  async findOne(userId: number, id: number) {
    const outfit = await this.prisma.outfit.findFirst({
      where: { id, userId },
      include: outfitInclude,
    });

    if (!outfit) {
      throw new NotFoundException("Outfit not found");
    }

    return toOutfitResponse(outfit);
  }

  async update(userId: number, id: number, { name, occasion, itemIds, isFavorite }: UpdateOutfitDto) {
    await this.findOwned(userId, id);

    if (itemIds) {
      await this.assertOwnsItems(userId, itemIds);
    }

    // Only include the fields that were actually sent (occasion: null clears it)
    const data: Prisma.OutfitUpdateInput = {};
    if (name !== undefined) data.name = name;
    if (occasion !== undefined) data.occasion = occasion;
    if (isFavorite !== undefined) data.isFavorite = isFavorite;

    // All or nothing: replacing items and updating the outfit succeed together.
    // Limits raised from Prisma's defaults (maxWait 2 s, timeout 5 s): opening a new connection
    // to Neon can take several seconds, which made the transaction time out with a 500.
    const outfit = await this.prisma.$transaction(async (tx) => {
      if (itemIds) {
        await tx.outfitClothingItem.deleteMany({ where: { outfitId: id } });
        await tx.outfitClothingItem.createMany({
          data: itemIds.map((clothingItemId) => ({ outfitId: id, clothingItemId })),
        });
      }

      return tx.outfit.update({
        where: { id },
        data,
        include: outfitInclude,
      });
    }, { maxWait: 10000, timeout: 15000 });

    return toOutfitResponse(outfit);
  }

  async remove(userId: number, id: number) {
    await this.findOwned(userId, id);
    await this.prisma.outfit.delete({ where: { id } });
  }

  // Another user's outfit gets the same 404 as a missing one
  private async findOwned(userId: number, id: number) {
    const outfit = await this.prisma.outfit.findFirst({ where: { id, userId } });
    if (!outfit) {
      throw new NotFoundException("Outfit not found");
    }
    return outfit;
  }

  // Every item must exist AND belong to this user
  private async assertOwnsItems(userId: number, itemIds: number[]) {
    const ownedCount = await this.prisma.clothingItem.count({
      where: { id: { in: itemIds }, userId },
    });

    if (ownedCount !== itemIds.length) {
      throw new BadRequestException("One or more items were not found");
    }
  }
}
