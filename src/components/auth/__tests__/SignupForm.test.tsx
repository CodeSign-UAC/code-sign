import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SignupForm } from '../SignupForm'
import { supabase } from '@/lib/supabaseClient'

// Mock the supabase module
vi.mock('@/lib/supabaseClient')

describe('SignupForm', () => {
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders signup form with all fields', () => {
    render(<SignupForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    expect(screen.getByTestId('signup-form')).toBeDefined()
    expect(screen.getByTestId('signup-email-input')).toBeDefined()
    expect(screen.getByTestId('signup-password-input')).toBeDefined()
    expect(screen.getByTestId('confirm-password-input')).toBeDefined()
    expect(screen.getByTestId('signup-submit')).toBeDefined()
  })

  it('shows validation errors for invalid email', async () => {
    render(<SignupForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    const emailInput = screen.getByTestId('signup-email-input')
    const submitButton = screen.getByTestId('signup-submit')

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('signup-email-error')).toBeDefined()
      expect(
        screen.getByText('Ingrese un correo electrónico válido'),
      ).toBeDefined()
    })
  })

  it('shows validation errors for short password', async () => {
    render(<SignupForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    const emailInput = screen.getByTestId('signup-email-input')
    const passwordInput = screen.getByTestId('signup-password-input')
    const submitButton = screen.getByTestId('signup-submit')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('signup-password-error')).toBeDefined()
      expect(
        screen.getByText('La contraseña debe tener al menos 6 caracteres'),
      ).toBeDefined()
    })
  })

  it('shows validation errors for mismatched passwords', async () => {
    render(<SignupForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    const emailInput = screen.getByTestId('signup-email-input')
    const passwordInput = screen.getByTestId('signup-password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    const submitButton = screen.getByTestId('signup-submit')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'differentpassword' },
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId('confirm-password-error')).toBeDefined()
      expect(screen.getByText('Las contraseñas no coinciden')).toBeDefined()
    })
  })

  it('calls onSuccess when signup is successful', async () => {
    const mockSignUp = vi.mocked(supabase.auth.signUp)
    mockSignUp.mockResolvedValue({
      data: { user: {}, session: {} },
      error: null,
    } as any)

    render(<SignupForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    const emailInput = screen.getByTestId('signup-email-input')
    const passwordInput = screen.getByTestId('signup-password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    const submitButton = screen.getByTestId('signup-submit')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('calls onError when signup fails', async () => {
    const mockSignUp = vi.mocked(supabase.auth.signUp)
    const mockError = { message: 'User already exists' }
    mockSignUp.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    } as any)

    render(<SignupForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    const emailInput = screen.getByTestId('signup-email-input')
    const passwordInput = screen.getByTestId('signup-password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    const submitButton = screen.getByTestId('signup-submit')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(mockOnError).toHaveBeenCalledWith(
        'Error al crear cuenta: User already exists',
      )
    })
  })

  it('disables submit button while loading', async () => {
    const mockSignUp = vi.mocked(supabase.auth.signUp)
    mockSignUp.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({ data: { user: {}, session: {} }, error: null } as any),
            100,
          ),
        ),
    )

    render(<SignupForm onSuccess={mockOnSuccess} onError={mockOnError} />)

    const emailInput = screen.getByTestId('signup-email-input')
    const passwordInput = screen.getByTestId('signup-password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    const submitButton = screen.getByTestId('signup-submit')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    expect((submitButton as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText('Creando cuenta...')).toBeDefined()

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })
})
