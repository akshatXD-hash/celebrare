import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import Gallery from '../src/components/Gallery'
import useFetchPhotos from '../src/hooks/useFetchPhotos'
import { FAVOURITES_KEY } from '../src/reducers/favouritesReducer'

const photos = [
  { id: '0', author: 'Alejandro Escamilla' },
  { id: '10', author: 'Paul Jarvis' },
  { id: '11', author: 'Paul Jarvis' },
]

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => photos }))
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

it('returns loading, photos and error from the custom hook', async () => {
  const { result } = renderHook(() => useFetchPhotos())
  expect(result.current).toEqual({ photos: [], loading: true, error: null })
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current).toEqual({ photos, loading: false, error: null })
  expect(fetch).toHaveBeenCalledWith('https://picsum.photos/v2/list?limit=30', { signal: expect.any(AbortSignal) })
})

it('shows the loading state while a request is pending', () => {
  fetch.mockReturnValue(new Promise(() => {}))
  render(<Gallery />)
  expect(screen.getByText('Good things take a moment.')).toBeTruthy()
})

it('filters by author without another API request, and clears an empty result', async () => {
  render(<Gallery />)
  await screen.findByText('3 photographs')
  const search = screen.getByRole('textbox', { name: 'Search photos by author' })
  fireEvent.change(search, { target: { value: '  PAUL  ' } })
  expect(screen.getAllByRole('figure')).toHaveLength(2)
  expect(screen.queryByText('Alejandro Escamilla')).toBeNull()
  fireEvent.change(search, { target: { value: 'no-such-author' } })
  expect(screen.getByRole('heading', { name: 'No frames found.' })).toBeTruthy()
  fireEvent.click(screen.getAllByRole('button', { name: 'Clear search' })[0])
  expect(screen.getAllByRole('figure')).toHaveLength(3)
  expect(document.activeElement).toBe(search)
  expect(fetch).toHaveBeenCalledTimes(1)
})

it('restores favourites after remounting and persists their removal', async () => {
  const firstVisit = render(<Gallery />)
  fireEvent.click(await screen.findByRole('button', { name: 'Add photo 10 by Paul Jarvis to favourites' }))
  expect(JSON.parse(localStorage.getItem(FAVOURITES_KEY))).toEqual(['10'])
  firstVisit.unmount()
  render(<Gallery />)
  const heart = await screen.findByRole('button', { name: 'Remove photo 10 by Paul Jarvis from favourites' })
  expect(heart.getAttribute('aria-pressed')).toBe('true')
  fireEvent.click(heart)
  expect(JSON.parse(localStorage.getItem(FAVOURITES_KEY))).toEqual([])
})

it('shows a useful message when the API returns an HTTP error', async () => {
  fetch.mockResolvedValue({ ok: false, status: 503 })
  render(<Gallery />)
  expect((await screen.findByRole('alert')).textContent).toContain('photo service is unavailable')
  expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy()
})

it('handles a failed network request', async () => {
  fetch.mockRejectedValue(new TypeError('Failed to fetch'))
  render(<Gallery />)
  expect((await screen.findByRole('alert')).textContent).toContain('Check your connection')
})

it('handles an unreadable API response', async () => {
  fetch.mockResolvedValue({ ok: true, json: async () => ({ error: 'unavailable' }) })
  const { result } = renderHook(() => useFetchPhotos())
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.error).toContain('couldn’t read the collection')
})

it('stops waiting after 15 seconds', async () => {
  vi.useFakeTimers()
  fetch.mockImplementation((url, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
  }))
  const { result } = renderHook(() => useFetchPhotos())
  await act(async () => vi.advanceTimersByTimeAsync(15000))
  expect(result.current.loading).toBe(false)
  expect(result.current.error).toContain('too long')
})

it('aborts the pending request when the hook unmounts', () => {
  fetch.mockReturnValue(new Promise(() => {}))
  const { unmount } = renderHook(() => useFetchPhotos())
  const signal = fetch.mock.calls[0][1].signal
  unmount()
  expect(signal.aborted).toBe(true)
})

it('keeps hearts usable and explains when favourites cannot be saved', async () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Storage blocked', 'SecurityError')
  })
  render(<Gallery />)
  fireEvent.click(await screen.findByRole('button', { name: 'Add photo 0 by Alejandro Escamilla to favourites' }))
  expect(screen.getByRole('button', { name: 'Remove photo 0 by Alejandro Escamilla from favourites' }).getAttribute('aria-pressed')).toBe('true')
  expect(screen.getByRole('alert').textContent).toContain('won’t be kept after a refresh')
})

it('keeps the card and favourite button available when an image fails', async () => {
  render(<Gallery />)
  const photo = await screen.findByRole('img', { name: 'Photograph by Alejandro Escamilla' })
  fireEvent.error(photo)
  expect(screen.getByText('This photo couldn’t be loaded')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Add photo 0 by Alejandro Escamilla to favourites' })).toBeTruthy()
})
