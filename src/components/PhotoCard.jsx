import { useState } from 'react'
import { FrameIcon, HeartIcon } from './Icons'

export default function PhotoCard({ photo, index, isFavourite, onToggle }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <li className="group min-w-0">
      <figure>
        <div className="relative overflow-hidden rounded-t-[3rem] rounded-b-md border border-line bg-white/70 p-[7px] shadow-sm transition-shadow duration-300 hover:shadow-md">
          <div className="aspect-[4/3] overflow-hidden rounded-t-[2.6rem] rounded-b-[2px] bg-line/40">
            {imageFailed ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-muted">
                <FrameIcon className="size-8" />
                <span className="text-center text-sm">This photo couldn’t be loaded</span>
              </div>
            ) : (
              <img
                src={`https://picsum.photos/id/${photo.id}/640/480`}
                alt={`Photograph by ${photo.author}`}
                width="640"
                height="480"
                loading={index < 4 ? 'eager' : 'lazy'}
                decoding="async"
                onError={() => setImageFailed(true)}
                className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.035]"
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => onToggle(photo.id)}
            aria-label={`${isFavourite ? 'Remove' : 'Add'} photo ${photo.id} by ${photo.author} ${isFavourite ? 'from' : 'to'} favourites`}
            aria-pressed={isFavourite}
            className={`absolute top-4 right-4 flex size-11 cursor-pointer items-center justify-center rounded-full shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${isFavourite ? 'bg-accent text-white hover:bg-[#7c4753]' : 'bg-paper/95 text-accent hover:bg-white hover:text-ink'}`}
          >
            <HeartIcon className="size-[19px]" filled={isFavourite} />
          </button>
        </div>
        <figcaption className="flex items-center justify-between gap-3 px-0.5 pt-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.16em] text-muted uppercase">Through the lens of</p>
            <p className="mt-1 truncate text-sm font-medium" title={photo.author}>{photo.author}</p>
          </div>
          <span className="font-display text-xl text-muted/65" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        </figcaption>
      </figure>
    </li>
  )
}
