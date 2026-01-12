import { appApi } from "../api"; // if separate files, import baseQueryWithReauth instead

export const categoriesApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Category"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // getCategories: builder.query({
      //   query: ({ page, limit }) => `/category?page=${page}&limit=${limit}`,
      //   providesTags: ["Category"],
      //   transformResponse: (res) => {
      //     return {
      //       categories: res.data.docs,
      //       pagination: {
      //         totalDocs: res?.data?.totalDocs,
      //         limit: res?.data?.limit,
      //         totalPages: res?.data?.totalPages,
      //         page: res?.data?.page,
      //         pagingCounter: res?.data?.pagingCounter,
      //         hasPrevPage: res?.data?.hasPrevPage,
      //         hasNextPage: res?.data?.hasNextPage,
      //         prevPage: res?.data?.prevPage,
      //         nextPage: res?.data?.nextPage,
      //       },
      //     };
      //   },
      // }),
      getCategories: builder.query({
        query: () => `/category`,
        providesTags: ["Category"],
        transformResponse: (res) => res.data,
      }),
      addCategory: builder.mutation({
        query: (body) => ({
          url: "/category",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Category"],
      }),
      deleteCategory: builder.mutation({
        query: (id) => ({
          url: `/category/${id}`,
          method: "DELETE",
        }),
        // Optimistic UI Update
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            categoriesApi.util.updateQueryData(
              "getCategories",
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
      getCategoryById: builder.query({
        query: (id) => `/category/${id}`,
        providesTags: (result, error, id) => [{ type: "Category", id: id }],
        transformResponse: (res) => res.data,
      }),
      updateCategoryById: builder.mutation({
        query: ({ id, payload }) => ({
          url: `/category/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: ["Category"],
      }),
    }),
  });

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryByIdMutation
} = categoriesApi;
