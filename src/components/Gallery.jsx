import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos'
import { FAVOURITES_KEY, favouritesReducer, loadFavourites } from '../reducers/favouritesReducer'
import { FrameIcon, HeartIcon, SearchIcon } from './Icons'
import PhotoCard from './PhotoCard'
import SearchInput from './SearchInput'

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos()
  const [search, setSearch] = useState('')
  const [favourites, dispatch] = useReducer(favouritesReducer, [], loadFavourites)
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [favourites])

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value)
  }, [])

  const clearSearch = useCallback(() => {
    setSearch('')
  }, [])

  const filteredPhotos = useMemo(() => {
    const query = search.trim().toLowerCase()
    return photos.filter((photo) => photo.author.toLowerCase().includes(query))
  }, [photos, search])

  function toggleFavourite(id) {
    dispatch({ type: 'toggle', id })
  }

  return (
    <>
      <section className="relative grid gap-8 border-b border-line pt-10 pb-11 md:grid-cols-[1.3fr_1fr] md:items-end md:gap-16 md:pt-14 md:pb-14" aria-labelledby="gallery-title">
        <div>
          <p className="mb-5 flex items-center gap-2.5 text-[10px] font-semibold tracking-[0.2em] text-muted uppercase sm:text-[11px]">
            <span className="size-1.5 rounded-full bg-accent" />
            A photo journal of the everyday
          </p>
          <h1 id="gallery-title" className="font-display text-[clamp(3.5rem,6.5vw,6.2rem)] leading-[1.02] tracking-[-0.035em]">
            Life, in<br />
            <span className="text-accent italic">little frames.</span>
          </h1>
        </div>
        <div className="max-w-sm md:justify-self-end md:pb-1">
          <p className="text-[15px] leading-relaxed text-muted sm:text-base">The places we pass. The details we miss.<br className="hidden sm:block" /> A few reasons to pause and look a little closer.</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full border border-accent/20 text-accent">
              <HeartIcon className="size-4" filled={favourites.length > 0} />
            </span>
            <p className="text-xs text-muted" aria-live="polite" aria-atomic="true">
              <span className="font-semibold text-ink">{favourites.length} {favourites.length === 1 ? 'favourite' : 'favourites'}</span>
              <span className="mx-2 text-line">/</span>
              {storageError ? 'saved for this visit' : 'kept in this browser'}
            </p>
          </div>
        </div>
      </section>

      <section className="pt-7 pb-16 sm:pt-8 sm:pb-20" aria-labelledby="collection-title" aria-busy={loading}>
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-baseline gap-3">
            <h2 id="collection-title" className="font-display text-[28px] tracking-[-0.02em]">The collection</h2>
            <p className="text-xs text-muted" role="status" aria-live="polite" aria-atomic="true">
              {loading ? 'Gathering frames…' : error ? 'Unavailable' : `${filteredPhotos.length} ${filteredPhotos.length === 1 ? 'photograph' : 'photographs'}`}
            </p>
          </div>
          <SearchInput value={search} onChange={handleSearch} onClear={clearSearch} />
        </div>

        {storageError && (
          <p role="alert" className="mb-6 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent">Your browser isn’t allowing local storage. Favourites work for this visit, but won’t be kept after a refresh.</p>
        )}

        {loading ? (
          <div role="status" className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-line">
            <span className="size-7 animate-spin rounded-full border-2 border-line border-t-accent motion-reduce:animate-none" aria-hidden="true" />
            <p className="font-display text-2xl">Good things take a moment.</p>
            <p className="text-sm text-muted">Finding a little perspective…</p>
          </div>
        ) : error ? (
          <div role="alert" className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 text-center">
            <FrameIcon className="mb-5 size-9 text-accent" />
            <h3 className="font-display text-3xl">A moment out of focus.</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{error}</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-6 cursor-pointer rounded-md bg-ink px-5 py-3 text-sm text-paper transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">Try again</button>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 text-center">
            <SearchIcon className="mb-5 size-8 text-accent" />
            <h3 className="font-display text-3xl">{search.trim() ? 'No frames found.' : 'Nothing here just yet.'}</h3>
            <p className="mt-3 max-w-md break-words text-sm leading-relaxed text-muted">{search.trim() ? `No photographers match “${search.trim()}”. Try another name.` : 'The collection is empty. Please check back in a little while.'}</p>
            {search && <button type="button" onClick={clearSearch} className="mt-5 cursor-pointer text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">Clear search</button>}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} index={photos.indexOf(photo)} isFavourite={favourites.includes(photo.id)} onToggle={toggleFavourite} />
            ))}
          </ul>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="mt-14 flex items-center justify-center gap-4 text-muted">
            <span className="h-px w-10 bg-line" />
            <span className="text-[10px] tracking-[0.16em] uppercase">A little pause looks good on you</span>
            <span className="h-px w-10 bg-line" />
          </div>
        )}
      </section>
    </>
  )
}
