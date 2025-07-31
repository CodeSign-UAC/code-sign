import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AuthLayout } from '../AuthLayout'
import { supabase } from '@/lib/supabaseClient'

// Mock the supabase module
vi.mock('@/lib/supabaseClient')

describe('AuthLayout', () => {
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form by default', () => {
    render(<AuthLayout onSuccess={mockOnSuccess} />)

    expect(screen.getByText('Bienvenido de nuevo')).toBeDefined()
    expect(screen.getByText('Inicie sesión para continuar')).toBeDefined()
    expect(screen.getByTestId('login-form')).toBeDefined()
    expect(screen.getByTestId('auth-mode-toggle')).toBeDefined()
    expect(screen.getByText('¿No tiene cuenta? Crear una')).toBeDefined()
  })

  it('toggles to signup form when clicking toggle button', async () => {
    render(<AuthLayout onSuccess={mockOnSuccess} />)

    const toggleButton = screen.getByTestId('auth-mode-toggle')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByText('Crear cuenta')).toBeDefined()
      expect(screen.getByText('Únase a CodeSign para comenzar')).toBeDefined()
      expect(screen.getByTestId('signup-form')).toBeDefined()
      expect(screen.getByText('¿Ya tiene cuenta? Iniciar sesión')).toBeDefined()
    })
  })

  it('toggles back to login form', async () => {
    render(<AuthLayout onSuccess={mockOnSuccess} />)

    const toggleButton = screen.getByTestId('auth-mode-toggle')

    // Switch to signup
    fireEvent.click(toggleButton)
    await waitFor(() => {
      expect(screen.getByTestId('signup-form')).toBeDefined()
    })

    // Switch back to login
    fireEvent.click(toggleButton)
    await waitFor(() => {
      expect(screen.getByTestId('login-form')).toBeDefined()
      expect(screen.getByText('Bienvenido de nuevo')).toBeDefined()
    })
  })

  it('displays error message when form fails', async () => {
    const mockSignIn = vi.mocked(supabase.auth.signInWithPassword)
    const mockError = { message: 'Invalid credentials' }
    mockSignIn.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    } as any)

    render(<AuthLayout onSuccess={mockOnSuccess} />)

    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('login-submit')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('auth-error')).toBeDefined()
      expect(
        screen.getByText('Error al iniciar sesión: Invalid credentials'),
      ).toBeDefined()
    })
  })

  it('clears error when switching between forms', async () => {
    const mockSignIn = vi.mocked(supabase.auth.signInWithPassword)
    const mockError = { message: 'Invalid credentials' }
    mockSignIn.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    } as any)

    render(<AuthLayout onSuccess={mockOnSuccess} />)

    // Trigger an error
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('login-submit')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('auth-error')).toBeDefined()
    })

    // Switch to signup form
    const toggleButton = screen.getByTestId('auth-mode-toggle')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.queryByTestId('auth-error')).toBeNull()
    })
  })

  it('shows password recovery link only in login mode', async () => {
    render(<AuthLayout onSuccess={mockOnSuccess} />)

    // Should show in login mode
    expect(screen.getByText('¿Olvidó su contraseña?')).toBeDefined()
    expect(screen.getByText('Recupérela aquí')).toBeDefined()

    // Switch to signup mode
    const toggleButton = screen.getByTestId('auth-mode-toggle')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.queryByText('¿Olvidó su contraseña?')).toBeNull()
      expect(screen.queryByText('Recupérela aquí')).toBeNull()
    })
  })
})
