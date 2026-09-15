import api from '../lib/axios'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    refreshToken: string
    expiresAt: string
    user: {
      id: string
      name: string
      email: string
      role: string
      phone?: string
      emailVerified: boolean
    }
  }
}

export const authService = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (token: string, email: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', {
      token,
      email,
      newPassword,
      confirmPassword: newPassword,
    })
    return response.data
  },
}
