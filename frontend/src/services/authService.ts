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

export interface SendOtpDto {
  phoneNumber: string
  purpose: 'login' | 'registration' | 'phone-verification'
}

export interface OtpLoginDto {
  phoneNumber: string
  otpCode: string
}

export interface VerifyOtpDto {
  phoneNumber: string
  otpCode: string
  purpose: 'login' | 'registration' | 'phone-verification'
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

export interface ApiResponse {
  success: boolean
  message: string
}

export const authService = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  loginWithOtp: async (data: OtpLoginDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/login-otp', data)
    return response.data
  },

  sendOtp: async (data: SendOtpDto): Promise<ApiResponse> => {
    const response = await api.post('/auth/send-otp', data)
    return response.data
  },

  verifyOtp: async (data: VerifyOtpDto): Promise<ApiResponse> => {
    const response = await api.post('/auth/verify-otp', data)
    return response.data
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

    // Logout service method for cookie-based auth
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
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
