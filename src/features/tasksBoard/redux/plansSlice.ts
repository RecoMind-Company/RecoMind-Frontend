import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PlanApiResponse, Plan } from "../types";

export const plansSlice = createApi({
  reducerPath: "plans",
  tagTypes: ["Plan"],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.recomind.site/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllPlans: builder.query<Plan[], void>({
      query: () => ({
        url: "/api/Plan/GetAll",
        method: "GET",
      }),
      // Unwrap the nested `value` wrapper
      transformResponse: (response: PlanApiResponse[]) =>
        response
          .filter((item) => item.isSuccess && item.value)
          .map((item) => item.value)
          .filter((plan) => plan.status),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Plan" as const, id })),
              { type: "Plan", id: "LIST" },
            ]
          : [{ type: "Plan", id: "LIST" }],
    }),
  }),
});

export const { useGetAllPlansQuery } = plansSlice;
