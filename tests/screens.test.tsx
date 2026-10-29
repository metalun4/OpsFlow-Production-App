import React from "react";
import { act, create, ReactTestRenderer } from "react-test-renderer";
import { ActivityIndicator, Alert, FlatList } from "react-native";
import RecipesScreen from "../app/(recipe)/RecipesScreen";
import EntityListScreen from "../app/(entity)/EntityListScreen";
import { useGetCustomersQuery, useGetOrdersQuery, useGetPlansQuery, useGetRecipesQuery } from "../store/slices/apiSlice";

jest.mock("../store/slices/apiSlice", () => ({
  useGetCustomersQuery: jest.fn(), useGetRecipesQuery: jest.fn(),
  useGetOrdersQuery: jest.fn(), useGetPlansQuery: jest.fn(),
}));
jest.mock("../components/recipe/RecipeCard/RecipeCard", () => "RecipeCard");
jest.mock("../components/order/OrderCard/OrderCard", () => "OrderCard");
jest.mock("../components/plan/PlanCard/PlanCard", () => "PlanCard");
jest.mock("../components/plan/PlanCard/PlanCardActive", () => "PlanCardActive");
jest.mock("../components/plan/PlansHeader", () => "PlansHeader");

const loaded = { data: [], isLoading: false, isFetching: false, isError: false, refetch: jest.fn() };
let renderer: ReactTestRenderer;
beforeEach(() => {
  [useGetCustomersQuery, useGetRecipesQuery, useGetOrdersQuery, useGetPlansQuery].forEach((hook) => {
    (hook as jest.Mock).mockReturnValue(loaded);
  });
});
afterEach(() => { act(() => renderer?.unmount()); jest.restoreAllMocks(); });

test("a customer-only request failure renders a retry state without alerts or crashing", () => {
  (useGetCustomersQuery as jest.Mock).mockReturnValue({ ...loaded, isError: true });
  const alert = jest.spyOn(Alert, "alert");
  act(() => { renderer = create(<RecipesScreen {...{ route: { params: { active: true } } } as any} />); });
  expect(renderer.root.findAllByType(FlatList)).toHaveLength(0);
  expect(JSON.stringify(renderer.toJSON())).toContain("Tekrar");
  expect(alert).not.toHaveBeenCalled();
});

test("entity lists display a loading indicator before query data exists", () => {
  (useGetOrdersQuery as jest.Mock).mockReturnValue({ ...loaded, data: undefined, isLoading: true });
  act(() => { renderer = create(<EntityListScreen {...{ route: { params: { approved: 0 } }, navigation: {} } as any} />); });
  expect(renderer.root.findAllByType(ActivityIndicator)).toHaveLength(1);
});

test("order and plan tabs retain their status filtering", () => {
  (useGetOrdersQuery as jest.Mock).mockReturnValue({ ...loaded, data: [{ id: 1, isApproved: 0 }, { id: 2, isApproved: 1 }] });
  (useGetPlansQuery as jest.Mock).mockReturnValue({ ...loaded, data: [{ id: 1, inBuffer: true }, { id: 2, inBuffer: false }] });
  act(() => { renderer = create(<EntityListScreen {...{ route: { params: { approved: 0 } }, navigation: {} } as any} />); });
  expect(renderer.root.findByType(FlatList).props.data).toEqual([{ id: 1, isApproved: 0 }]);
  act(() => { renderer.update(<EntityListScreen {...{ route: { params: { active: false } }, navigation: {} } as any} />); });
  expect(renderer.root.findByType(FlatList).props.data).toEqual([{ id: 2, inBuffer: false }]);
});
