import { memo, useRef } from 'react'
import { CloseIcon, SearchIcon } from './Icons'

const SearchInput = memo(function SearchInput({ value, onChange, onClear }) {
  const inputRef = useRef(null)

  return (
    <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-line bg-white/60 pr-1 pl-4 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 sm:w-80">
      <SearchIcon className="size-[18px] shrink-0 text-muted" />
      <label className="sr-only" htmlFor="author-search">Search photos by author</label>
      <input
        ref={inputRef}
        id="author-search"
        type="text"
        autoComplete="off"
        spellCheck="false"
        value={value}
        onChange={onChange}
        placeholder="Search by author…"
        className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onClear()
            inputRef.current.focus()
          }}
          aria-label="Clear search"
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
})

export default SearchInput
