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
      <section className="relative isolate overflow-hidden border-b border-line px-3 pt-14 pb-11 text-center sm:pt-16 sm:pb-14" aria-labelledby="gallery-title">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,#f4e3dc_0%,transparent_70%)] opacity-50" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-7 top-6 bottom-[-1px] -z-10 rounded-t-[50%] border border-gold/25 sm:inset-x-[18%]" />
        <img src="./botanical-spray.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -top-2 -left-20 -z-10 w-44 -rotate-12 opacity-45 sm:top-4 sm:-left-12 sm:w-64 sm:opacity-70 lg:left-0 lg:w-72 xl:left-8 xl:w-80" />
        <img src="./botanical-spray.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-20 -bottom-8 -z-10 w-44 -scale-x-100 -rotate-12 opacity-45 sm:top-4 sm:-right-12 sm:bottom-auto sm:w-64 sm:opacity-70 lg:right-0 lg:w-72 xl:right-8 xl:w-80" />
        <div className="mx-auto max-w-2xl">
          <p className="mb-5 flex items-center justify-center gap-3 text-[9px] font-medium tracking-[0.19em] text-accent uppercase sm:text-[10px] sm:tracking-[0.25em]">
            <span aria-hidden="true" className="h-px w-6 bg-gold/60" />
            A collection to fall in love with
            <span aria-hidden="true" className="h-px w-6 bg-gold/60" />
          </p>
          <h1 id="gallery-title" className="font-display text-[clamp(2.7rem,5.6vw,5.2rem)] leading-[1.08] tracking-[-0.035em]">
            Some moments<br />
            <span className="text-accent italic">stay with you.</span>
          </h1>
        </div>
        <div className="mx-auto mt-5 max-w-sm">
          <p className="text-sm leading-relaxed text-muted sm:text-[15px]">A collection of everyday beauty, held a little closer.<br className="hidden sm:block" /> Keep the frames that feel like you.</p>
          <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-paper/80 px-4 py-2.5">
            <span className="text-accent">
              <HeartIcon className="size-3.5" filled={favourites.length > 0} />
            </span>
            <p className="text-[11px] text-muted" aria-live="polite" aria-atomic="true">
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
            <span className="font-display text-base text-accent italic">Keep a little of what you love.</span>
            <span className="h-px w-10 bg-line" />
          </div>
        )}
      </section>
    </>
  )
}
