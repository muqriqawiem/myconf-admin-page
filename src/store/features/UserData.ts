import { User } from '@/model/User';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const UserApiSlice = createApi({
  reducerPath: 'userapi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['conference'],
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => `/get-all-users`,
      transformResponse: (response: ApiResponse<User[]>) => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      },
      providesTags: ['conference'],
    }),
    deleteUsers: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: '/delete-users',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['conference'],
    }),
  }),
});

// Export hooks for usage in functional components
export const { 
  useGetAllUsersQuery,
  useDeleteUsersMutation, 
} = UserApiSlice;
