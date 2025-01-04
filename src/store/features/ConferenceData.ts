import { IConference } from '@/model/ConferenceSchema';
import { User } from '@/model/User';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
// Creating a mapped type that modifies conferenceOrganizer to be a string
type IModifiedConference = Omit<IConference, 'conferenceOrganizer' | 'conferenceStatus'> & {
  conferenceOrganizer: { _id: string, fullname: string };
  conferenceStatus: "accepted" | "submitted" | "rejected" | "review"
};

export const ConferenceApiSlice = createApi({
  reducerPath: 'conferenceapi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['conference'],
  endpoints: (builder) => ({
    getAllConferences: builder.query<IConference[], void>({
      query: () => `/get-all-conferences`,
      transformResponse: (response: ApiResponse<IConference[]>) => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      },
      providesTags: ['conference'], //to refetch data after deletion
    }),
    getConferenceByConferenceID: builder.query<IModifiedConference, string>({
      query: (confName) => `/get-conference-by-conference-id?confName=${confName}`,
      transformResponse: (response: ApiResponse<IModifiedConference>) => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      },
    }),
    //add the deleteConference endpoint
    deleteConferences: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: '/delete-conferences',
        method: 'DELETE',
        body: { ids }, //send the array of IDs to delete
      }),
      invalidatesTags: ['conference'], //invalidate the 'conference' tag to refetch data
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllConferencesQuery,
  useGetConferenceByConferenceIDQuery,
  useDeleteConferencesMutation,
} = ConferenceApiSlice;
