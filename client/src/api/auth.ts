import type { LoginDto, RegisterDto, UpdateProfileDto } from "@styled/shared";
import { apiFetch } from "./client";
import type { User } from "./types";

export function getMe() {
  return apiFetch<{ user: User }>("/api/auth/me").then((data) => data.user);
}

export function updateMe(dto: UpdateProfileDto) {
  return apiFetch<{ user: User }>("/api/auth/me", { method: "PATCH", body: dto }).then((data) => data.user);
}

export function login(dto: LoginDto) {
  return apiFetch<{ token: string; user: User }>("/api/auth/login", { method: "POST", body: dto });
}

export function register(dto: RegisterDto) {
  return apiFetch<{ user: User }>("/api/auth/register", { method: "POST", body: dto });
}
