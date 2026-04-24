import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorMessage from '../ErrorMessage'

describe('ErrorMessage', () => {
  describe('happy path', () => {
    // Protects against error text not rendering
    it('should render the error message', () => {
      render(<ErrorMessage message="Something went wrong" />)

      expect(
        screen.getByText(/something went wrong/i)
      ).toBeInTheDocument()
    })

    // Protects retry functionality breaking
    it('should render retry button and call onRetry when clicked', async () => {
      const handleRetry = jest.fn()

      render(
        <ErrorMessage 
          message="Error occurred" 
          onRetry={handleRetry} 
        />
      )

      const button = screen.getByRole('button', { name: /try again/i })

      expect(button).toBeInTheDocument()

      await userEvent.click(button)

      expect(handleRetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    // Protects against button rendering when it shouldn't
    it('should not render retry button if onRetry is not provided', () => {
      render(<ErrorMessage message="Error occurred" />)

      const button = screen.queryByRole('button', { name: /try again/i })

      expect(button).not.toBeInTheDocument()
    })

    // Extra safety: empty message still renders container
    it('should render even if message is empty', () => {
      render(<ErrorMessage message="" />)

      // Just checking component doesn't crash
      const container = screen.getByText('', { selector: 'p' })
      expect(container).toBeInTheDocument()
    })
  })
})