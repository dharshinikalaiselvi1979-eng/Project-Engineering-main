import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OrdersList from '../OrdersList'
import { useOrders } from '../../hooks/useOrders'

jest.mock('../../hooks/useOrders')

describe('OrdersList', () => {
  describe('happy path', () => {
    // Protects against orders not rendering
    it('should render list of orders', () => {
      useOrders.mockReturnValue({
        orders: [
          { id: 1, name: 'Order 1', date: '2024-01-01', status: 'Delivered' },
          { id: 2, name: 'Order 2', date: '2024-01-02', status: 'Processing' },
        ],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(<OrdersList />)

      expect(screen.getByText(/order 1/i)).toBeInTheDocument()
      expect(screen.getByText(/order 2/i)).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    // Protects empty UI regression
    it('should show empty state when no orders', () => {
      useOrders.mockReturnValue({
        orders: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      })

      render(<OrdersList />)

      expect(screen.getByText(/no orders yet/i)).toBeInTheDocument()
      expect(
        screen.getByText(/your first order will appear here/i)
      ).toBeInTheDocument()
    })
  })

  describe('error state', () => {
    // Protects error rendering + retry action
    it('should show error message and call refetch on retry', async () => {
      const mockRefetch = jest.fn()

      useOrders.mockReturnValue({
        orders: [],
        isLoading: false,
        error: 'Error',
        refetch: mockRefetch,
      })

      render(<OrdersList />)

      expect(
        screen.getByText(/something went wrong loading your orders/i)
      ).toBeInTheDocument()

      const retryButton = screen.getByRole('button', { name: /try again/i })

      await userEvent.click(retryButton)

      expect(mockRefetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('loading state', () => {
    // Protects loading UI presence
    it('should show loading skeleton when loading', () => {
      useOrders.mockReturnValue({
        orders: [],
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      })

      render(<OrdersList />)

      // No real text → check that list is NOT shown
      expect(screen.queryByText(/order/i)).not.toBeInTheDocument()
    })
  })
})