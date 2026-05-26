import { Type, Mail, Hash, List, ToggleLeft, Lock } from "lucide-react";

export const FIELD_TYPES = [
  { value: "TEXT", label: "Text", icon: Type },
  { value: "EMAIL", label: "Email", icon: Mail },
  { value: "NUMBER", label: "Number", icon: Hash },
  { value: "SELECT", label: "Select", icon: List },
  { value: "YES_NO", label: "Yes / No", icon: ToggleLeft },
  { value: "PASSWORD", label: "Password", icon: Lock },
] as const;

export type FeildType = (typeof FIELD_TYPES)[number]["value"];

export function getFieldIcon(type: string) {
  const entry = FIELD_TYPES.find((f) => f.value === type);
  return entry?.icon ?? Type;
}

export function getFieldLabel(type: string) {
  const entry = FIELD_TYPES.find((f) => f.value === type);
  return entry?.label ?? type;
}
