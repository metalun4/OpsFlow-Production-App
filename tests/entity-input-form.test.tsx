import React from "react";
import { act, create, ReactTestRenderer } from "react-test-renderer";
import { Alert, TextInput } from "react-native";
import EntityInputForm from "../components/shared/EntityInputForm";
import PrimaryButton from "../components/shared/PrimaryButton";
import { Customer, Plan, Recipe } from "../constants/types";
import { turkishStrings } from "../constants/strings";

jest.mock("@react-navigation/native", () => ({ useNavigation: () => ({ goBack: jest.fn() }) }));
jest.mock("../components/shared/Dropdown", () => "Dropdown");
jest.mock("../components/shared/DateDropdown", () => "DateDropdown");
jest.mock("../components/recipe/RecipeDetails/RecipeDetails", () => "RecipeDetails");

const customers: Customer[] = [
  { id: 1, customerName: "A", customerCode: "A" },
  { id: 2, customerName: "B", customerCode: "B" },
];
const recipes = [
  { id: 1, customerId: 1, isActive: true },
  { id: 2, customerId: 2, isActive: true },
] as Recipe[];
const props = {
  entityType: "plan" as const, currentEntity: null,
  recipes, customers, submitHandler: jest.fn().mockResolvedValue(undefined),
  loadingStates: { isLoading: false, isMutating: false, isError: false },
};

let renderer: ReactTestRenderer;
const dropdowns = () => renderer.root.findAllByType("Dropdown" as any);
const save = () => renderer.root.findAllByType(PrimaryButton)[0].props.onPress();

beforeEach(() => { jest.spyOn(Alert, "alert").mockImplementation(() => {}); });
afterEach(() => { act(() => renderer?.unmount()); jest.restoreAllMocks(); });

function selectRecipe() {
  act(() => { dropdowns()[0].props.handleSelect(customers[0]); });
  act(() => { dropdowns()[1].props.handleSelect(recipes[0]); });
}

test("editing derives selections when query data arrives and preserves them on refresh", () => {
  const plan: Plan = { id: 1, recipeId: 1, customerId: 1, batchCount: 1, multiplier: 1, inBuffer: false, currentBatch: 0 };
  act(() => { renderer = create(<EntityInputForm {...props} currentEntity={plan} customers={[]} recipes={[]} />); });
  act(() => { renderer.update(<EntityInputForm {...props} currentEntity={plan} />); });
  expect(dropdowns()[0].props.selectedItem).toBe(customers[0]);
  expect(dropdowns()[1].props.selectedItem).toBe(recipes[0]);
  const refreshed = { ...recipes[0], recipeName: "Updated" };
  act(() => { renderer.update(<EntityInputForm {...props} currentEntity={plan} recipes={[refreshed]} />); });
  expect(dropdowns()[1].props.selectedItem.recipeName).toBe("Updated");
});

test("changing the customer immediately clears the previous recipe", () => {
  act(() => { renderer = create(<EntityInputForm {...props} />); });
  selectRecipe();
  act(() => { dropdowns()[0].props.handleSelect(customers[1]); });
  expect(dropdowns()[1].props.selectedItem).toBeNull();
  expect(dropdowns()[1].props.items).toEqual([recipes[1]]);
});

test.each(["2.5", "12oops", "Infinity", "0"])("rejects invalid batch count %s", (value) => {
  act(() => { renderer = create(<EntityInputForm {...props} />); });
  selectRecipe();
  act(() => { renderer.root.findAllByType(TextInput)[0].props.onChangeText(value); });
  act(save);
  expect(Alert.alert).toHaveBeenCalledWith(
    turkishStrings.main.warning, expect.stringContaining("Batch"), expect.any(Array),
  );
  expect(props.submitHandler).not.toHaveBeenCalled();
});

test("accepts a comma decimal multiplier and submits the parsed value", () => {
  act(() => { renderer = create(<EntityInputForm {...props} />); });
  selectRecipe();
  act(() => { renderer.root.findAllByType(TextInput)[1].props.onChangeText("1,25"); });
  act(save);
  const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
  act(() => { buttons[0].onPress(); });
  expect(props.submitHandler).toHaveBeenCalledWith({ batchCount: 1, multiplier: 1.25, recipeId: 1, customerId: 1 });
});

test("blocks saves when reference data failed to load", () => {
  act(() => { renderer = create(<EntityInputForm {...props} loadingStates={{ ...props.loadingStates, isError: true }} />); });
  expect(renderer.root.findAllByType(PrimaryButton)[0].props.disabled).toBe(true);
  act(save);
  expect(Alert.alert).not.toHaveBeenCalled();
});

test("order saves serialize the selected date to an ISO string", () => {
  act(() => { renderer = create(<EntityInputForm {...props} entityType="order" />); });
  selectRecipe();
  const date = new Date("2026-11-02T12:00:00Z");
  act(() => { renderer.root.findByType("DateDropdown" as any).props.handleSelect(date); });
  act(save);
  const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
  act(() => { buttons[0].onPress(); });
  expect(props.submitHandler).toHaveBeenCalledWith({ amount: 1, shipmentDate: date.toISOString(), recipeId: 1, customerId: 1 });
});
