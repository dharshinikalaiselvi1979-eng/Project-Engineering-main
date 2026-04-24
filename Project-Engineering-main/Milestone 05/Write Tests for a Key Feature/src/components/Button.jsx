import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  describe('happy path', () => {
    // Protects against label not rendering
    it('should render button with correct label', () => {
      render(<Button label="Click Me" />)

      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
    })

    // Protects against click handler breaking
    it('should call onClick when clicked', async () => {
      const handleClick = jest.fn()

      render(<Button label="Click Me" onClick={handleClick} />)

      const button = screen.getByRole('button', { name: /click me/i })
      await userEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    // Protects against disabled state regression
    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn()

      render(<Button label="Click Me" onClick={handleClick} disabled />)

      const button = screen.getByRole('button', { name: /click me/i })

      expect(button).toBeDisabled()

      await userEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    // 🔥 IMPORTANT (matches your component logic)
    it('should show loading text and disable button when loading', () => {
      render(<Button label="Submit" loading />)

      const button = screen.getByRole('button')

      expect(button).toBeDisabled()
      expect(button).toHaveTextContent(/loading/i)
    })

    // Extra safety: loading prevents clicks
    it('should not call onClick when loading', async () => {
      const handleClick = jest.fn()

      render(<Button label="Submit" onClick={handleClick} loading />)

      const button = screen.getByRole('button')

      await userEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })
})