import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? '/api'
    : import.meta.env.VITE_API_URL,
})

export const fetchPosts = () => api.get('/posts/')
export const fetchPost = (id) => api.get(`/posts/${id}/`)
export const createPost = (data) => api.post('/posts/', data)
export const deletePost = (id) => api.delete(`/posts/${id}/`)
export const fetchComments = (postId) => api.get(`/posts/${postId}/comments/`)
export const createComment = (postId, data) => api.post(`/posts/${postId}/comments/`, data)
export const upvotePost = (postId, body = {}) => api.post(`/posts/${postId}/`, body)
