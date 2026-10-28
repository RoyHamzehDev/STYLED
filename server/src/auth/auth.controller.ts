import { Body, Controller, Get, HttpCode, Patch, Post, UseGuards } from "@nestjs/common";
import {
  LoginSchema,
  RegisterSchema,
  UpdateProfileSchema,
  type LoginDto,
  type RegisterDto,
  type UpdateProfileDto,
} from "@styled/shared";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe.js";
import { AuthService } from "./auth.service.js";
import { JwtAuthGuard } from "./jwt-auth.guard.js";
import { UserId } from "./user-id.decorator.js";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // POST /api/auth/register → 201 (Nest's default status for POST)
  @Post("register")
  async register(@Body(new ZodValidationPipe(RegisterSchema)) dto: RegisterDto) {
    return { user: await this.auth.register(dto) };
  }

  // POST /api/auth/login → 200 (@HttpCode overrides the POST default)
  @Post("login")
  @HttpCode(200)
  login(@Body(new ZodValidationPipe(LoginSchema)) dto: LoginDto) {
    return this.auth.login(dto);
  }

  // GET /api/auth/me
  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@UserId() userId: number) {
    return { user: await this.auth.getProfile(userId) };
  }

  // UPDATE PROFILE: PATCH /api/auth/me
  @Patch("me")
  @UseGuards(JwtAuthGuard)
  async updateMe(
    @UserId() userId: number,
    @Body(new ZodValidationPipe(UpdateProfileSchema)) dto: UpdateProfileDto
  ) {
    return { user: await this.auth.updateProfile(userId, dto) };
  }
}
