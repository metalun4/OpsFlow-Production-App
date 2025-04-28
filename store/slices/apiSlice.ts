import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { Customer, Order, OrderData, Plan, PlanData, Recipe } from "../../constants/types";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: retry(
    fetchBaseQuery({
      baseUrl: apiUrl,
      timeout: 15000,
    }),
    { maxRetries: 3 },
  ),
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
      invalidatesTags: ["Plans"],
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
