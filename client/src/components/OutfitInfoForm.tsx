import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateOutfitSchema, type UpdateOutfitDto } from "@styled/shared";
import type { Outfit } from "../api/types";
import { useUpdateOutfit } from "../hooks/useOutfits";
import { BUTTON_SECONDARY } from "../utils/buttons";
import { FormAlert } from "./FormAlert";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";

type OutfitInfoFormProps = {
  outfit: Outfit;
  onDone: () => void;
};

// Inline editing of an outfit's name and occasion on the details page.
export function OutfitInfoForm({ outfit, onDone }: OutfitInfoFormProps) {
  const updateMutation = useUpdateOutfit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UpdateOutfitSchema),
    defaultValues: { name: outfit.name, occasion: outfit.occasion ?? "" },
  });

  const onSubmit = handleSubmit((dto: UpdateOutfitDto) => {
    updateMutation.mutate(
      // An emptied occasion is sent as null, which tells the server to clear it.
      { id: outfit.id, dto: { name: dto.name, occasion: dto.occasion || null } },
      { onSuccess: onDone },
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {updateMutation.error && <FormAlert message={updateMutation.error.message} />}
      <FormField label="Name" registration={register("name")} error={errors.name?.message} />
      <FormField
        label="Occasion"
        placeholder="Leave empty to remove it"
        registration={register("occasion")}
        error={errors.occasion?.message}
      />
      <div className="flex gap-2 pt-2 sm:justify-end">
        <button type="button" onClick={onDone} disabled={updateMutation.isPending} className={`${BUTTON_SECONDARY} flex-1 sm:flex-none`}>
          Cancel
        </button>
        <div className="flex-1 sm:w-40 sm:flex-none">
          <SubmitButton isLoading={updateMutation.isPending} loadingLabel="Saving...">
            Save
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
