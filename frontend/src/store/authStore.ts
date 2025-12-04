import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCartStore } from './cartStore'
import { queryClient } from '../main'

export interface User {
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

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        // Clear cart store state immediately (synchronously)
        const cartStore = useCartStore.getState()
        cartStore.clearCart().catch(console.error)
        
        // Also reset the cart state directly to ensure immediate UI update
        useCartStore.setState({ items: [], totalItems: 0, totalPrice: 0 })
        
        // Clear all React Query caches to prevent showing cached data after logout
        queryClient.clear()
        
        localStorage.removeItem('token')
        localStorage.removeItem('auth-storage')
        localStorage.removeItem('cart-storage')
        localStorage.removeItem('user')
        set({ user: null, token: null, isAuthenticated: false })
      },
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
