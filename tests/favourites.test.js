import { afterEach, describe, expect, it, vi } from 'vitest'
import { FAVOURITES_KEY, favouritesReducer, loadFavourites } from '../src/reducers/favouritesReducer'

afterEach(() => localStorage.clear())

describe('favourites', () => {
  it('adds and removes a photo without changing the previous state', () => {
    const previous = Object.freeze(['10'])
    const added = favouritesReducer(previous, { type: 'toggle', id: '11' })
    expect(added).toEqual(['10', '11'])
    expect(favouritesReducer(added, { type: 'toggle', id: '10' })).toEqual(['11'])
    expect(previous).toEqual(['10'])
  })

  it('leaves the state alone for an unknown action', () => {
    const previous = ['10']
    expect(favouritesReducer(previous, { type: 'unknown' })).toBe(previous)
  })

  it('restores saved IDs and ignores duplicates or invalid entries', () => {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(['0', '10', '10', null, 7]))
    expect(loadFavourites()).toEqual(['0', '10'])
  })

  it.each(['broken json', '{}', 'null'])('recovers from invalid storage: %s', (value) => {
    localStorage.setItem(FAVOURITES_KEY, value)
    expect(loadFavourites()).toEqual([])
  })

  it('starts empty when browser storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage blocked', 'SecurityError')
    })
    expect(loadFavourites()).toEqual([])
  })
})
