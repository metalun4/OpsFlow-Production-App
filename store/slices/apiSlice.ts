import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { Customer, Order, OrderData, Plan, PlanData, Recipe } from "../../constants/types";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const baseQuery = fetchBaseQuery({ baseUrl: apiUrl, timeout: 15000 });

// A timed-out write may already have succeeded on the server. Never replay it.
const baseQueryWithRetry = retry<typeof baseQuery>(
  async (args, api, extraOptions) => {
    if (!apiUrl) {
      retry.fail({ status: "CUSTOM_ERROR", error: "EXPO_PUBLIC_API_URL is not configured" });
    }

    const result = await baseQuery(args, api, extraOptions);
    if (result.error) {
      const status = result.error.status;
      if (
        api.type === "mutation" ||
        (typeof status === "number" && status < 500) ||
        status === "PARSING_ERROR"
      ) {
        retry.fail(result.error, result.meta);
      }
    }
    return result;
  },
  { maxRetries: 3 },
);

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["Recipes", "Customers", "Plans", "Orders"],
  keepUnusedDataFor: 120, // 2 mins
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // Recipes endpoints
    getRecipes: builder.query<Recipe[], void>({
      query: () => "/recipes?all=true",
      providesTags: ["Recipes"],
    }),

    getRecipeById: builder.query<Recipe, number>({
      query: (id) => `/recipes/${id}`,
      providesTags: (result, error, id) => [{ type: "Recipes", id }],
    }),

    // Customers endpoints
    getCustomers: builder.query<Customer[], void>({
      query: () => "/customers",
      providesTags: ["Customers"],
    }),

    // Plans endpoints
    getPlans: builder.query<Plan[], void>({
      query: () => "/production-plans",
      providesTags: ["Plans"],
    }),

    addPlan: builder.mutation<Plan, PlanData>({
      query: (planData) => ({
        url: "/production-plans",
        method: "POST",
        body: planData,
      }),
      invalidatesTags: ["Plans"],
    }),

    updatePlan: builder.mutation<Plan, Partial<Plan> & { id: number }>({
      query: ({ id, ...plan }) => ({
        url: `/production-plans/${id}`,
        method: "PATCH",
        body: {
          batchCount: plan.batchCount,
          multiplier: plan.multiplier,
        },
      }),
      invalidatesTags: ["Plans"],
    }),

    deletePlan: builder.mutation<void, number>({
      query: (id) => ({
        url: `/production-plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plans"],
    }),

    // Orders endpoints
    getOrders: builder.query<Order[], void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),

    addOrder: builder.mutation<Order, OrderData>({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),

    updateOrder: builder.mutation<Order, Partial<Order> & { id: number }>({
      query: ({ id, ...order }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: {
          amount: order.amount,
          shipmentDate: order.shipmentDate,
          isApproved: order.isApproved,
        },
      }),
      invalidatesTags: ["Orders"],
    }),

    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useGetCustomersQuery,
  useGetPlansQuery,
  useAddPlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetOrdersQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = apiSlice;
