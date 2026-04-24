import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../LoginForm'
import { useLogin } from '../../hooks/useLogin'

jest.mock('../../hooks/useLogin')

describe('LoginForm', () => {
  describe('happy path', () => {
    it('should render email, password and submit button', () => {
      useLogin.mockReturnValue({
        handleLogin: jest.fn(),
        isLoading: false,
        error: null,
      })

      render(<LoginForm />)

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument()
    })

    it('should call handleLogin with email and password on submit', async () => {
      const mockLogin = jest.fn()

      useLogin.mockReturnValue({
        handleLogin: mockLogin,
        isLoading: false,
        error: null,
      })

      render(<LoginForm />)

      await userEvent.type(screen.getByLabelText(/email/i), 'test@mail.com')
      await userEvent.type(screen.getByLabelText(/password/i), '123456')

      await userEvent.click(
        screen.getByRole('button', { name: /sign in/i })
      )

      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@mail.com',
        password: '123456',
      })
    })
  })

  describe('failure cases', () => {
    it('should display error message when error exists', () => {
      useLogin.mockReturnValue({
        handleLogin: jest.fn(),
        isLoading: false,
        error: 'Invalid credentials',
      })

      render(<LoginForm />)

      expect(
        screen.getByText(/invalid credentials/i)
      ).toBeInTheDocument()
    })

    it('should disable button and show loading text when loading', () => {
      useLogin.mockReturnValue({
        handleLogin: jest.fn(),
        isLoading: true,
        error: null,
      })

      render(<LoginForm />)

      const button = screen.getByRole('button')

      expect(button).toBeDisabled()
      expect(button).toHaveTextContent(/loading/i)
    })
  })

  describe('edge cases', () => {
    it('should call handleLogin even if fields are empty (no validation here)', async () => {
      const mockLogin = jest.fn()

      useLogin.mockReturnValue({
        handleLogin: mockLogin,
        isLoading: false,
        error: null,
      })

      render(<LoginForm />)

      await userEvent.click(
        screen.getByRole('button', { name: /sign in/i })
      )

      expect(mockLogin).toHaveBeenCalledWith({
        email: '',
        password: '',
      })
    })
  })
})