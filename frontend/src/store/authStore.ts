import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCartStore } from './cartStore'
import { queryClient } from '../main'
import api from '../lib/axios'

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
  isAuthenticated: boolean
  setAuth: (user: User) => void  //REMOVED token parameter because cookies are used
  logout: () => Promise<void>
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      // ✅ Token is no longer stored - only user data
      setAuth: (user) => {
        set({ user, isAuthenticated: true })
      },
      
      // ✅ Call backend to clear HTTP-only cookie
      logout: async () => {
        try {
          // Call backend logout endpoint to clear cookie
          await api.post('/auth/logout')
        } catch (error) {
          console.error('Logout API call failed:', error)
          // Continue with local cleanup even if API fails
        }

        // Clear cart store state immediately (synchronously)
        const cartStore = useCartStore.getState()
        cartStore.clearCart().catch(console.error)
        
        // Also reset the cart state directly to ensure immediate UI update
        useCartStore.setState({ items: [], totalItems: 0, totalPrice: 0 })
        
        // Clear all React Query caches to prevent showing cached data after logout
        queryClient.clear()
        
        // ✅ REMOVED: localStorage.removeItem('token')
        localStorage.removeItem('auth-storage')
        localStorage.removeItem('cart-storage')
        localStorage.removeItem('user')
        set({ user: null, isAuthenticated: false })
      },
      
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },
    }),
    {
      name: 'auth-storage',
      // ✅ Only persist user data, not tokens
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
