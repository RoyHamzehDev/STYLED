import { BadRequestException, type PipeTransform } from "@nestjs/common";
import type { z } from "zod";

// [{ field: "email", message: "Invalid email" }], the same shape the Express version sent
export function formatErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

// A pipe runs on a handler argument before the handler: this one validates AND transforms it
// (trim, toLowerCase, dedupe...) with a schema from @styled/shared, so the handler only ever sees valid data.
// Usage: @Body(new ZodValidationPipe(CreateItemSchema)) dto: CreateItemDto
export class ZodValidationPipe<T extends z.ZodType> implements PipeTransform<unknown, z.output<T>> {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.output<T> {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      // The global filter sends this object as is: 400 { errors: [...] }
      throw new BadRequestException({ errors: formatErrors(result.error) });
    }
    return result.data;
  }
}
