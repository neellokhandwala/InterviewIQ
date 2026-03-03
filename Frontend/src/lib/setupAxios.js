import axiosInstance from './axios'

export const setupAxiosInterceptor = (getToken) => {
  axiosInstance.interceptors.request.use(async (config) => {
    const token = await getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
}