import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { CATEGORIES, COLORS, CreateItemSchema, SEASONS, STYLES, type CreateItemDto } from "@styled/shared";
import { ApiError } from "../api/client";
import type { ClothingItem } from "../api/types";
import { useCreateItem, useUpdateItem, useUploadImage } from "../hooks/useItems";
import { BUTTON_SECONDARY } from "../utils/buttons";
import { COLOR_SWATCHES } from "../utils/colors";
import { ChipSelect } from "./ChipSelect";
import { FormAlert } from "./FormAlert";
import { FormField } from "./FormField";
import { ImagePicker } from "./ImagePicker";
import { SubmitButton } from "./SubmitButton";

// The shared schema without imageUrl: the URL only exists after the upload,
// which happens after validation. The photo is checked separately below,
// and the server still validates the complete object with CreateItemSchema.
const ItemFormSchema = CreateItemSchema.omit({ imageUrl: true });
type ItemFormValues = Omit<CreateItemDto, "imageUrl">;

const FORM_FIELDS = ["name", "category", "styles", "colors", "seasons"] as const;

// Adds the value if missing, removes it if present (for multi-select chips).
function toggle<T>(list: T[] | undefined, value: T): T[] {
  const current = list ?? [];
  return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
}

// Used for both create (no `item`) and edit (`item` given).
export function ItemForm({ item }: { item?: ClothingItem }) {
  const navigate = useNavigate();
  const uploadMutation = useUploadImage();
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();

  const [file, setFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>();
  // Remembers the uploaded URL for the current file, so if saving fails
  // and the user retries, we don't upload the same image twice.
  const [uploaded, setUploaded] = useState<{ file: File; url: string } | null>(null);

  // A local blob: URL lets us preview the picked file before it's uploaded.
  const filePreview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  // Free the blob URL's memory when the file changes or the form unmounts.
  useEffect(() => () => void (filePreview && URL.revokeObjectURL(filePreview)), [filePreview]);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    // Explicit type: defaultValues may leave category empty (create mode),
    // but the submitted values are always complete once validation passes.
  } = useForm<ItemFormValues>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: {
      name: item?.name ?? "",
      category: item?.category,
      styles: item?.styles ?? [],
      colors: item?.colors ?? [],
      seasons: item?.seasons ?? [],
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!file && !item) {
      setImageError("Please add a photo of the item.");
      return;
    }
    uploadMutation.reset();
    createMutation.reset();
    updateMutation.reset();

    try {
      // 1. Upload the new photo if one was picked (edit mode can keep the old one).
      let imageUrl = item?.imageUrl ?? "";
      if (file) {
        if (uploaded?.file === file) {
          imageUrl = uploaded.url;
        } else {
          imageUrl = await uploadMutation.mutateAsync(file);
          setUploaded({ file, url: imageUrl });
        }
      }

      // 2. Create or update the item with the image URL.
      const dto = { ...values, imageUrl };
      if (item) await updateMutation.mutateAsync({ id: item.id, dto });
      else await createMutation.mutateAsync(dto);

      navigate("/wardrobe");
    } catch (error) {
      // Server validation errors go under their fields; anything else shows in the banner.
      if (error instanceof ApiError && error.status === 400) {
        for (const { field, message } of error.body.errors ?? []) {
          if (field === "imageUrl") setImageError(message);
          const name = FORM_FIELDS.find((f) => f === field);
          if (name) setError(name, { message });
        }
      }
    }
  });

  const requestError = uploadMutation.error ?? createMutation.error ?? updateMutation.error;
  const bannerMessage =
    requestError instanceof ApiError && requestError.status === 400 && requestError.body.errors?.length
      ? undefined
      : requestError?.message;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      {bannerMessage && <FormAlert message={bannerMessage} />}

      <ImagePicker
        previewUrl={filePreview ?? item?.imageUrl ?? null}
        disabled={isSubmitting}
        onFileSelected={(picked) => {
          setFile(picked);
          setImageError(undefined);
        }}
        onInvalidFile={setImageError}
        error={imageError}
      />

      <FormField label="Name" placeholder="e.g. White linen shirt" registration={register("name")} error={errors.name?.message} />

      {/* Controller connects custom inputs (our chips) to React Hook Form. */}
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <ChipSelect
            label="Category"
            options={CATEGORIES}
            selected={field.value ? [field.value] : []}
            onToggle={field.onChange}
            // Zod's default enum message lists every option, so show a friendlier one.
            error={errors.category && "Pick a category"}
          />
        )}
      />
      <Controller
        control={control}
        name="colors"
        render={({ field }) => (
          <ChipSelect
            label="Colors"
            options={COLORS}
            selected={field.value ?? []}
            onToggle={(color) => field.onChange(toggle(field.value, color))}
            swatches={COLOR_SWATCHES}
            error={errors.colors?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="styles"
        render={({ field }) => (
          <ChipSelect
            label="Styles"
            options={STYLES}
            selected={field.value ?? []}
            onToggle={(style) => field.onChange(toggle(field.value, style))}
            error={errors.styles?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="seasons"
        render={({ field }) => (
          <ChipSelect
            label="Seasons"
            options={SEASONS}
            selected={field.value ?? []}
            onToggle={(season) => field.onChange(toggle(field.value, season))}
            error={errors.seasons?.message}
          />
        )}
      />

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Link to="/wardrobe" className={BUTTON_SECONDARY}>
          Cancel
        </Link>
        <div className="sm:w-48">
          {/* isSubmitting stays true for the whole async onSubmit (upload + save). */}
          <SubmitButton
            isLoading={isSubmitting}
            loadingLabel={uploadMutation.isPending ? "Uploading image..." : "Saving..."}
          >
            {item ? "Save changes" : "Add item"}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
