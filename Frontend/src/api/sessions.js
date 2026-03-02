import axiosInstance from '../lib/axios'

export const sessionApi = {
  createSession: async (data) => {
    const res = await axiosInstance.post('/sessions', data)
    return res.data
  },
  getActiveSessions: async () => {
    const res = await axiosInstance.get('/sessions/active')
    return res.data
  },
  getMyRecentSessions: async () => {
    const res = await axiosInstance.get('/sessions/my-recent')
    return res.data
  },
  getSessionById: async (id) => {
    const res = await axiosInstance.get(`/sessions/${id}`)
    return res.data
  },
  joinSession: async (id) => {
    const res = await axiosInstance.post(`/sessions/${id}/join`)
    return res.data
  },
  endSession: async (id) => {
    const res = await axiosInstance.post(`/sessions/${id}/end`)
    return res.data
  },
  getStreamToken: async () => {
    const res = await axiosInstance.get('/chat/token')
    return res.data
  },
}