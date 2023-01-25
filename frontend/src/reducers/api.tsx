// Import the RTK Query methods from the React-specific entry point
import { FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Thread, ThreadWithComments, Comment, LoginUser, NewComment, NewThread, TagThread } from '../app/types'
import { RootState } from '../app/store'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_URI,
        prepareHeaders: (headers, { getState }) => { // Set JWT token for authentication
            const token = (getState() as RootState).auth.token
            if (token) { // if token exists
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        }
    }),
    tagTypes: ['Thread', 'Comment'],
    endpoints: builder => ({
        getThreadsByTag: builder.query<Thread[], string>({
            queryFn: async (tag, _api, _extraOptions, baseFetch) => {
                let threads;
                if (tag === '') {
                    threads = await baseFetch('/threads')
                } else {
                    threads = await baseFetch(`/tags/${tag}`)
                }

                if (threads.error) {
                    return {error: threads.error as FetchBaseQueryError}
                } else {
                    return {data: threads.data as Thread[]} 
                }
            },
            providesTags: ['Thread']
        }), 
        getThreadById: builder.query<ThreadWithComments, number>({
            queryFn: async (threadId, _api, _extraOptions, baseFetch) => {
                const thread = await baseFetch(`/threads/${threadId}`)
                const comments = await baseFetch(`/comments/t-${threadId}`)
                if (thread.error) {
                    return {error: thread.error as FetchBaseQueryError}
                } else if (comments.error) {
                    return {error: comments.error as FetchBaseQueryError}
                }

                return {
                    data: {
                        ...thread.data as Thread,
                        Comments: comments.data as Comment[]
                    } as ThreadWithComments 
                }
            },
            providesTags: ['Comment']
        }),
        createNewThread: builder.mutation<Thread, NewThread>({
            query: (newThread: NewThread) => ({
                url: "/threads",
                method: "POST",
                body: JSON.stringify({
                    ...newThread,
                    Postedon: new Date().toJSON()
                })
            }),
            invalidatesTags: ['Thread']
        }),
        getCommentById: builder.query<Comment, number>({
            query: (id: number) => `/comments/c-${id}`
        }),
        createNewComment: builder.mutation<Comment, NewComment>({
            query: (newComment: NewComment) => ({
                url: "/comments",
                method: "POST",
                body: JSON.stringify({
                    ...newComment,
                    Postedon: new Date().toJSON()
                })
            }),
            invalidatesTags: ['Comment']
        }),
        login: builder.mutation<string, LoginUser>({
            query: (user: LoginUser) => ({
                url: "/login",
                method: "POST",
                body: JSON.stringify(user),
                responseHandler: "text" // Backend returns a string token
            }),
        }),
        createNewUser: builder.mutation<string, LoginUser>({
            query: (user: LoginUser) => ({
                url: "/user",
                method: "POST",
                body: JSON.stringify(user),
                responseHandler: "text"
            })
        }),
        createTagThread: builder.mutation<TagThread, TagThread>({
            query: (tagThread: TagThread) => ({
                url: "/tags",
                method: "POST",
                body: JSON.stringify(tagThread)
            })
        })

    })
})

export const { 
    useGetThreadsByTagQuery, 
    useGetThreadByIdQuery, 
    useGetCommentByIdQuery,
    useCreateNewThreadMutation,
    useCreateNewCommentMutation,
    useCreateNewUserMutation,
    useCreateTagThreadMutation,
    useLoginMutation
} = apiSlice