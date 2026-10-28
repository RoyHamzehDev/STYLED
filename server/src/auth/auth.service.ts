import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { LoginDto, RegisterDto, UpdateProfileDto } from "@styled/shared";
import type { Prisma } from "../../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { env } from "../config/env.js";

// Every user query selects these fields only, so passwordHash never leaves the server
const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  preferredStyles: true,
  favoriteColors: true,
  createdAt: true,
} as const;

// The service holds the business logic; it throws Nest exceptions and the global filter turns them into JSON
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register({ name, email, password }: RegisterDto) {
    // 1. Make sure the email isn't taken
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException("Email is already registered");
    }

    // 2. Hash the password and save the user
    const passwordHash = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: { name, email, passwordHash },
      select: publicUserSelect,
    });
  }

  async login({ email, password }: LoginDto) {
    // 1. Find the user and check the password
    const user = await this.prisma.user.findUnique({ where: { email } });
    const passwordMatches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // 2. Create a signed token containing the user id
    const token = jwt.sign({ sub: String(user.id) }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 3. Return the token and the user (without the hash)
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return { token, user: safeUser };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: publicUserSelect,
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  updateProfile(userId: number, { name, preferredStyles, favoriteColors }: UpdateProfileDto) {
    // Only include the fields that were actually sent
    const data: Prisma.UserUpdateInput = {};
    if (name !== undefined) data.name = name;
    if (preferredStyles !== undefined) data.preferredStyles = preferredStyles;
    if (favoriteColors !== undefined) data.favoriteColors = favoriteColors;

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: publicUserSelect,
    });
  }
}
