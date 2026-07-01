import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import HomePage from './page'

afterEach(cleanup)

async function submitDraw(input: HTMLElement, value: string) {
  const user = userEvent.setup()
  await user.type(input, value)
  fireEvent.submit(input.closest('form')!)
}

describe('HomePage', () => {
  test('accepts a drawn number and displays it', async () => {
    render(<HomePage />)

    const input = screen.getByPlaceholderText('Digite um número entre 1 e 75')
    await submitDraw(input, '42')

    expect(screen.getAllByText('42')).toHaveLength(2)
    expect((input as HTMLInputElement).value).toBe('')
  })

  test('rejects a number outside the 1-75 range', async () => {
    render(<HomePage />)

    const input = screen.getByPlaceholderText('Digite um número entre 1 e 75')
    await submitDraw(input, '99')

    expect(screen.getByRole('alert').textContent).toBe('Digite um número entre 1 e 75.')
    expect(screen.getByText('--')).toBeDefined()
  })

  test('lists drawn numbers in the recent draws history', async () => {
    render(<HomePage />)

    const input = screen.getByPlaceholderText('Digite um número entre 1 e 75')
    await submitDraw(input, '7')
    await submitDraw(input, '23')

    expect(screen.getAllByText('07')).toHaveLength(1)
    expect(screen.getAllByText('23')).toHaveLength(2)
  })
})
