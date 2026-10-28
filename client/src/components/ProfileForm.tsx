import type { ReactNode } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CalendarDays, CircleCheck, Mail, Palette, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { COLORS, STYLES, UpdateProfileSchema, type UpdateProfileDto } from "@styled/shared";
import type { User } from "../api/types";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { BUTTON_PRIMARY } from "../utils/buttons";
import { COLOR_SWATCHES } from "../utils/colors";
import { formatDate } from "../utils/format";
import { ChipSelect } from "./ChipSelect";
import { FormAlert } from "./FormAlert";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";

// The shared schema has every field optional (a PATCH can send any subset), but this form
// always holds all three, so it validates with the same schema made fully required.
const ProfileFormSchema = UpdateProfileSchema.required();
type ProfileValues = Required<UpdateProfileDto>;

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function sameSet<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((v) => b.includes(v));
}

// Only the fields that differ from the saved user. Arrays are compared as sets,
// so unticking and re-ticking a chip (which changes the order) doesn't count as a change.
function getChanges(user: User, values: ProfileValues): UpdateProfileDto {
  const changes: UpdateProfileDto = {};
  if (values.name.trim() !== user.name) changes.name = values.name;
  if (!sameSet(values.preferredStyles, user.preferredStyles)) changes.preferredStyles = values.preferredStyles;
  if (!sameSet(values.favoriteColors, user.favoriteColors)) changes.favoriteColors = values.favoriteColors;
  return changes;
}

export function ProfileForm({ user }: { user: User }) {
  const updateMutation = useUpdateProfile();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: { name: user.name, preferredStyles: user.preferredStyles, favoriteColors: user.favoriteColors },
  });

  // useWatch re-renders on every change, so the save button can react to edits.
  const values = useWatch({ control }) as ProfileValues;
  const hasChanges = Object.keys(getChanges(user, values)).length > 0;

  const onSubmit = handleSubmit((validated) => {
    updateMutation.mutate(getChanges(user, validated), {
      // Make the saved values the form's new starting point (e.g. the trimmed name).
      onSuccess: (updated) =>
        reset({ name: updated.name, preferredStyles: updated.preferredStyles, favoriteColors: updated.favoriteColors }),
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <section className={SECTION_CLASS}>
        <SectionHeading icon={UserRound}>Account</SectionHeading>
        <dl className="mb-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-card bg-surface p-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden="true" />
            <div className="min-w-0">
              <dt className="text-xs text-ink-muted">Email</dt>
              <dd className="mt-0.5 font-medium break-all text-ink">{user.email}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-card bg-surface p-3">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden="true" />
            <div>
              <dt className="text-xs text-ink-muted">Member since</dt>
              <dd className="mt-0.5 font-medium text-ink">{formatDate(user.createdAt)}</dd>
            </div>
          </div>
        </dl>
        <FormField label="Name" autoComplete="name" registration={register("name")} error={errors.name?.message} />
      </section>

      <section className={`${SECTION_CLASS} space-y-6`}>
        <div>
          <SectionHeading icon={Palette}>Style preferences</SectionHeading>
          <p className="-mt-2 flex items-start gap-2 rounded-control bg-accent-soft px-3 py-2.5 text-sm text-ink">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-accent-strong" strokeWidth={1.75} aria-hidden="true" />
            These preferences will be used for AI outfit suggestions.
          </p>
        </div>
        <Controller
          control={control}
          name="preferredStyles"
          render={({ field }) => (
            <ChipSelect
              label="Preferred styles"
              options={STYLES}
              selected={field.value}
              onToggle={(style) => field.onChange(toggle(field.value, style))}
            />
          )}
        />
        <Controller
          control={control}
          name="favoriteColors"
          render={({ field }) => (
            <ChipSelect
              label="Favorite colors"
              options={COLORS}
              selected={field.value}
              onToggle={(color) => field.onChange(toggle(field.value, color))}
              swatches={COLOR_SWATCHES}
            />
          )}
        />
      </section>

      {updateMutation.error && <FormAlert message={updateMutation.error.message} />}

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        {/* Shown after saving, until the user changes something again. */}
        {updateMutation.isSuccess && !hasChanges && (
          <p role="status" className="flex items-center justify-center gap-1.5 text-sm font-medium text-success">
            <CircleCheck className="size-4" strokeWidth={1.75} aria-hidden="true" />
            Profile updated
          </p>
        )}
        <div className="sm:w-48">
          {hasChanges ? (
            <SubmitButton isLoading={updateMutation.isPending} loadingLabel="Saving...">
              Save changes
            </SubmitButton>
          ) : (
            <button type="button" disabled className={`${BUTTON_PRIMARY} w-full`}>
              No changes
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

const SECTION_CLASS = "rounded-panel border border-border bg-background p-5 shadow-md sm:p-8";

function SectionHeading({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-3 text-xl font-semibold">
      <span className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
        <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </span>
      {children}
    </h2>
  );
}
