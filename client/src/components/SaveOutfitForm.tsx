import { useEffect, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { CircleAlert, CircleCheck } from "lucide-react";
import { CreateOutfitSchema, type CreateOutfitDto } from "@styled/shared";
import type { Outfit } from "../api/types";
import { useCreateOutfit, useUpdateOutfit } from "../hooks/useOutfits";
import { BUTTON_PRIMARY } from "../utils/buttons";
import { FormAlert } from "./FormAlert";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";

const REDIRECT_DELAY_MS = 1200;

type SaveOutfitFormProps = {
  selectedIds: number[];
  outfit?: Outfit; // given = edit mode (PATCH), missing = create (POST)
};

export function SaveOutfitForm({ selectedIds, outfit }: SaveOutfitFormProps) {
  const navigate = useNavigate();
  const createMutation = useCreateOutfit();
  const updateMutation = useUpdateOutfit();
  const mutation = outfit ? updateMutation : createMutation;
  // Where to go after saving: the edited outfit, or the list for a new one.
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // CreateOutfitSchema works for both modes: in edit mode we also send all three fields.
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateOutfitSchema),
    defaultValues: { name: outfit?.name ?? "", occasion: outfit?.occasion ?? "", itemIds: [] as number[] },
  });

  // After saving: show the success message briefly, then navigate.
  useEffect(() => {
    if (!redirectTo) return;
    const timer = setTimeout(() => navigate(redirectTo), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [redirectTo, navigate]);

  const save = async (dto: CreateOutfitDto) => {
    try {
      if (outfit) {
        // Empty occasion -> null clears it on the server.
        await updateMutation.mutateAsync({ id: outfit.id, dto: { ...dto, occasion: dto.occasion || null } });
        setRedirectTo(`/outfits/${outfit.id}`);
      } else {
        await createMutation.mutateAsync({ ...dto, occasion: dto.occasion || undefined });
        setRedirectTo("/outfits");
      }
    } catch {
      // The error is shown from mutation.error below.
    }
  };

  // itemIds aren't typed into an input: they come from the builder. We copy them into
  // the form right before validating, so CreateOutfitSchema checks all three fields.
  const onSubmit = (e: FormEvent) => {
    setValue("itemIds", selectedIds);
    return handleSubmit(save)(e);
  };

  if (redirectTo) {
    return (
      <p role="status" className="flex items-center gap-2 rounded-control bg-success-soft px-4 py-3 text-sm font-medium text-success ring-1 ring-success/20">
        <CircleCheck className="size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        Outfit saved! Taking you there...
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {mutation.error && <FormAlert message={mutation.error.message} />}
      <FormField label="Outfit name" placeholder="e.g. Friday casual" registration={register("name")} error={errors.name?.message} />
      <FormField
        label="Occasion (optional)"
        placeholder="e.g. Work, date night"
        registration={register("occasion")}
        error={errors.occasion?.message}
      />
      {errors.itemIds && (
        <p className="flex items-center gap-1.5 text-sm text-danger">
          <CircleAlert className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {errors.itemIds.message}
        </p>
      )}
      {selectedIds.length === 0 ? (
        // Disabled until at least one item is picked.
        <button type="button" disabled className={`${BUTTON_PRIMARY} w-full`}>
          Select items to save
        </button>
      ) : (
        <SubmitButton isLoading={mutation.isPending} loadingLabel="Saving...">
          {outfit ? "Save changes" : "Save outfit"}
        </SubmitButton>
      )}
    </form>
  );
}
