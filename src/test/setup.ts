import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock Supabase client for testing
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}))

// Cleanup after each test case
afterEach(() => {
  cleanup()
})
