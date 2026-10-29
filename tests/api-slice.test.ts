/** @jest-environment node */
import { configureStore } from "@reduxjs/toolkit";

const { apiSlice } = require("../store/slices/apiSlice") as typeof import("../store/slices/apiSlice");

const makeStore = () => configureStore({
  reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});
let store: ReturnType<typeof makeStore>;
let fetchMock: jest.SpyInstance;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json" },
});

beforeEach(() => {
  jest.useFakeTimers();
  store = makeStore();
  fetchMock = jest.spyOn(global, "fetch");
});
afterEach(() => {
  store.dispatch(apiSlice.util.resetApiState());
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test("deleting an order refreshes subscribed orders without refetching plans", async () => {
  let deleted = false;
  fetchMock.mockImplementation(async (request: Request) => {
    if (request.method === "DELETE") { deleted = true; return json({}); }
    if (request.url.endsWith("/orders")) return json(deleted ? [] : [{ id: 1 }]);
    return json([]);
  });
  const orders = store.dispatch(apiSlice.endpoints.getOrders.initiate());
  const plans = store.dispatch(apiSlice.endpoints.getPlans.initiate());
  await Promise.all([orders.unwrap(), plans.unwrap()]);
  await store.dispatch(apiSlice.endpoints.deleteOrder.initiate(1)).unwrap();
  await jest.advanceTimersByTimeAsync(10);
  const requests = fetchMock.mock.calls.map(([request]: [Request]) => request);
  expect(requests.filter((request) => request.url.endsWith("/orders"))).toHaveLength(2);
  expect(requests.filter((request) => request.url.endsWith("/production-plans"))).toHaveLength(1);
  expect(apiSlice.endpoints.getOrders.select()(store.getState()).data).toEqual([]);
  orders.unsubscribe();
  plans.unsubscribe();
});

test.each(["addOrder", "addPlan", "updateOrder", "updatePlan", "deleteOrder", "deletePlan"] as const)(
  "%s is never automatically replayed after a server failure", async (endpoint) => {
    fetchMock.mockImplementation(async () => json({ message: "failed" }, 503));
    const argument = {
      id: 1, amount: 1, shipmentDate: null, batchCount: 1, multiplier: 1, customerId: 1, recipeId: 1,
    };
    const operation = endpoint === "deleteOrder" ? store.dispatch(apiSlice.endpoints.deleteOrder.initiate(1))
      : endpoint === "deletePlan" ? store.dispatch(apiSlice.endpoints.deletePlan.initiate(1))
      : endpoint === "addOrder" ? store.dispatch(apiSlice.endpoints.addOrder.initiate(argument))
      : endpoint === "addPlan" ? store.dispatch(apiSlice.endpoints.addPlan.initiate(argument))
      : endpoint === "updateOrder" ? store.dispatch(apiSlice.endpoints.updateOrder.initiate(argument))
      : store.dispatch(apiSlice.endpoints.updatePlan.initiate(argument));
    await jest.runAllTimersAsync();
    expect((await operation).error).toBeDefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  },
);

test("a write with a lost response is not replayed", async () => {
  fetchMock.mockRejectedValue(new TypeError("Network request failed"));
  const operation = store.dispatch(apiSlice.endpoints.addPlan.initiate({
    batchCount: 1, multiplier: 1, recipeId: 1, customerId: 1,
  }));
  await jest.runAllTimersAsync();
  expect((await operation).error).toBeDefined();
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test("queries still recover from transient server failures", async () => {
  fetchMock.mockResolvedValueOnce(json({}, 503)).mockResolvedValueOnce(json([]));
  const operation = store.dispatch(apiSlice.endpoints.getOrders.initiate());
  await jest.runAllTimersAsync();
  expect((await operation).data).toEqual([]);
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test("queries do not retry validation or authorization errors", async () => {
  fetchMock.mockImplementation(async () => json({}, 401));
  const operation = store.dispatch(apiSlice.endpoints.getOrders.initiate());
  await jest.runAllTimersAsync();
  expect((await operation).error).toBeDefined();
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
