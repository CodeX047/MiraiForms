export interface FeildItem {
  id: string;
  label: string;
  labelKey: string;
  description: string | null;
  placeholder: string | null;
  isRequired: boolean;
  type: string;
  index: string;
  choices?: string[] | null;
}

export interface FieldFormErrors {
  label?: string;
}
