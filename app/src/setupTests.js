import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('$app/environment', () => ({
  browser: true,
  dev: true,
  building: false,
}))
