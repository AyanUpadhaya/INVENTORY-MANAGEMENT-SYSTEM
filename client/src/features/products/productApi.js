import { appApi } from "../api"; // if separate files, import baseQueryWithReauth instead

export const productApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Product"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getProducts: builder.query({
        query: () => "/products",
        providesTags: ["Product"],
      }),
      addProduct: builder.mutation({
        query: (body) => ({
          url: "/products",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Product"],
      }),
      deleteProduct: builder.mutation({
        query: (id) => ({
          url: `/products/${id}`,
          method: "DELETE",
        }),

        // Optimistic UI Update
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            productApi.util.updateQueryData(
              "getProducts",
              undefined,
              (draft) => {
                return draft.filter((item) => item._id !== id);
              }
            )
          );

          try {
            await queryFulfilled;
          } catch {
            // ❗ rollback UI if failed
            patchResult.undo();
          }
        },
      }),
    }),
  });

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
} = productApi;
