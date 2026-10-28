import { BadRequestException, type PipeTransform } from "@nestjs/common";
import { z } from "zod";

// Turns "7" into 7, rejects "abc", "1.5", "-3", "0" (route params are always strings)
const IdSchema = z.coerce.number().int().positive();

// Usage: @Param("id", new ParseIdPipe("item")) id: number   →   400 { message: "Invalid item id" }
export class ParseIdPipe implements PipeTransform<string, number> {
  constructor(private readonly resource: string) {}

  transform(value: string): number {
    const result = IdSchema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(`Invalid ${this.resource} id`);
    }
    return result.data;
  }
}
