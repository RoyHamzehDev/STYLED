import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module.js";
import { HealthModule } from "./health/health.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { ItemsModule } from "./items/items.module.js";
import { UploadsModule } from "./uploads/uploads.module.js";
import { OutfitsModule } from "./outfits/outfits.module.js";

// The root module: Nest starts here and follows `imports` to build the whole app
@Module({
  imports: [PrismaModule, HealthModule, AuthModule, ItemsModule, UploadsModule, OutfitsModule],
})
export class AppModule {}
