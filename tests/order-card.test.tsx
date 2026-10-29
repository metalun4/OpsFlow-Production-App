import React from "react";
import { act, create, ReactTestRenderer } from "react-test-renderer";
import { Alert } from "react-native";
import OrderCard from "../components/order/OrderCard/OrderCard";
import PrimaryButton from "../components/shared/PrimaryButton";
import { Customer, Order, Recipe } from "../constants/types";
import { turkishStrings } from "../constants/strings";

const mockUpdateOrder = jest.fn();
jest.mock("../store/slices/apiSlice", () => ({
  useUpdateOrderMutation: () => [mockUpdateOrder, { isLoading: false }],
}));

const order: Order = { id: 1, amount: 10, shipmentDate: null, isApproved: 0, recipeId: 1, customerId: 1 };
const recipe = { id: 1, recipeName: "Recipe", revisionNo: 1 } as Recipe;
const customer: Customer = { id: 1, customerName: "Customer", customerCode: "C1" };
let renderer: ReactTestRenderer;
beforeEach(() => { jest.spyOn(Alert, "alert").mockImplementation(() => {}); });
afterEach(() => { act(() => renderer?.unmount()); jest.restoreAllMocks(); });

function renderOrder(value = order) {
  act(() => { renderer = create(<OrderCard order={value} recipe={recipe} customer={customer} onPress={jest.fn()} />); });
}

test.each([null, "invalid"])("missing or invalid shipment date %s does not crash the order list", (date) => {
  renderOrder({ ...order, shipmentDate: date });
  expect(JSON.stringify(renderer.toJSON())).toContain("Tarih belirtilmedi");
});

test("failed status changes show an error and preserve the update API contract", async () => {
  mockUpdateOrder.mockReturnValue({ unwrap: () => Promise.reject(new Error("failed")) });
  renderOrder();
  act(() => { renderer.root.findAllByType(PrimaryButton)[1].props.onPress(); });
  const confirm = (Alert.alert as jest.Mock).mock.calls[0][2][0].onPress;
  await act(async () => { await confirm(); });
  expect(mockUpdateOrder).toHaveBeenCalledWith({ id: 1, amount: 10, shipmentDate: null, isApproved: 1 });
  expect(Alert.alert).toHaveBeenLastCalledWith(turkishStrings.main.warning, turkishStrings.errors.somethingHappened);
});

test("repeated confirmations cannot start concurrent status changes", async () => {
  let resolve!: () => void;
  const pending = new Promise<void>((done) => { resolve = done; });
  mockUpdateOrder.mockReturnValue({ unwrap: () => pending });
  renderOrder();
  act(() => { renderer.root.findAllByType(PrimaryButton)[1].props.onPress(); });
  const confirm = (Alert.alert as jest.Mock).mock.calls[0][2][0].onPress;
  act(() => { void confirm(); void confirm(); });
  expect(mockUpdateOrder).toHaveBeenCalledTimes(1);
  await act(async () => { resolve(); });
});
