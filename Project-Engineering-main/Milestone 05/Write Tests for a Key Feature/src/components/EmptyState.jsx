import { render, screen } from '@testing-library/react'
import EmptyState from '../EmptyState'

describe('EmptyState', () => {
  describe('happy path', () => {
    // Protects against title not rendering
    it('should render the title text', () => {
      render(
        <EmptyState 
          title="No Orders" 
          message="You have no orders yet" 
        />
      )

      expect(screen.getByText(/no orders/i)).toBeInTheDocument()
    })

    // Protects against message not rendering
    it('should render the message text', () => {
      render(
        <EmptyState 
          title="No Orders" 
          message="You have no orders yet" 
        />
      )

      expect(screen.getByText(/you have no orders yet/i)).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    // Protects against missing props breaking UI
    it('should render without crashing when props are empty', () => {
      render(<EmptyState title="" message="" />)

      // Just checking component still renders
      const container = screen.getByText('', { selector: 'h3' })
      expect(container).toBeInTheDocument()
    })
  })
})
