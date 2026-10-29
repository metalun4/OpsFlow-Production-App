import { Customer, Recipe } from "../../../constants/types";

export type DropdownItem = Customer | Recipe;

export type DropdownProps<T extends DropdownItem> = {
  title: string;
  items: T[];
  selectedItem: T | null;
  handleSelect: (item: T | null) => void;
  disabled: boolean;
  buttonText: string;
};

export function getDisplayText(item: DropdownItem): string {
  return "revisionNo" in item
    ? `${item.recipeName} R:${item.revisionNo}`
    : item.customerName;
}
