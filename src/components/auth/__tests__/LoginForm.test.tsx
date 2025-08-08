import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { LoginForm } from '../LoginForm'
import { supabase } from '@/lib/supabaseClient'

// Mock the supabase module
vi.mock('@/lib/supabaseClient')

describe('LoginForm', () => {
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form with all fields', () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    expect(screen.getByTestId('login-form')).toBeDefined()
    expect(screen.getByTestId('email-input')).toBeDefined()
    expect(screen.getByTestId('password-input')).toBeDefined()
    expect(screen.getByTestId('login-submit')).toBeDefined()
  })

  it('shows validation errors for invalid email', async () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    const emailInput = screen.getByTestId('email-input')
    const submitButton = screen.getByTestId('login-submit')

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeDefined()
      expect(
        screen.getByText('Ingrese un correo electrónico válido'),
      ).toBeDefined()
    })
  })

  it('shows validation errors for short password', async () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('login-submit')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('password-error')).toBeDefined()
      expect(
        screen.getByText('La contraseña debe tener al menos 4 caracteres'),
      ).toBeDefined()
    })
  })

  it('calls onSuccess when login is successful', async () => {
    const mockSignIn = vi.mocked(supabase.auth.signInWithPassword)
    mockSignIn.mockResolvedValue({
      data: { user: {}, session: {} },
      error: null,
    } as any)

    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('login-submit')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('calls onError when login fails', async () => {
    const mockSignIn = vi.mocked(supabase.auth.signInWithPassword)
    const mockError = { message: 'Invalid credentials' }
    mockSignIn.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    } as any)

    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('login-submit')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
      expect(mockOnError).toHaveBeenCalledWith(
        'Error al iniciar sesión: Invalid credentials',
      )
    })
  })

  it('disables submit button while loading', async () => {
    const mockSignIn = vi.mocked(supabase.auth.signInWithPassword)
    mockSignIn.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({ data: { user: {}, session: {} }, error: null } as any),
            100,
          ),
        ),
    )

    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('login-submit')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    expect((submitButton as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText('Cargando...')).toBeDefined()

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })
})
