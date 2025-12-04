import api from '../lib/axios'

export interface UpdateProfileData {
  name: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface UserResponse {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    email: string
    role: string
    phone?: string
    address?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    emailVerified: boolean
  }
}

export const userService = {
  updateProfile: async (data: UpdateProfileData): Promise<UserResponse> => {
    const response = await api.put('/users/me', data)
    return response.data
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get('/users/me')
    return response.data
  },
}
