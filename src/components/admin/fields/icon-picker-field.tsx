import { Controller, type Control, type FieldValues, type FieldPath } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ICON_NAMES, AdminIcon, type IconName } from "@/lib/content/icon-map";

const ICON_DISPLAY_NAMES: Record<IconName, string> = {
  gem: "Gem",
  "rotate-ccw": "Returns arrow",
  leaf: "Leaf",
  ruler: "Ruler",
  truck: "Truck",
  "shield-check": "Shield check",
  "badge-check": "Badge check",
  package: "Package",
  heart: "Heart",
  sparkles: "Sparkles",
  clock: "Clock",
  "credit-card": "Credit card",
  recycle: "Recycle",
  award: "Award",
};

export function IconPickerField<T extends FieldValues>({
  control,
  name,
  label = "Icon",
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value as string} onValueChange={field.onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an icon" />
            </SelectTrigger>
            <SelectContent>
              {ICON_NAMES.map((iconName) => (
                <SelectItem key={iconName} value={iconName}>
                  <span className="flex items-center gap-2">
                    <AdminIcon name={iconName} className="size-4" />
                    {ICON_DISPLAY_NAMES[iconName]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </Field>
  );
}
