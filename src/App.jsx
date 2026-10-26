import Gallery from './components/Gallery'
import { FrameIcon } from './components/Icons'

export default function App() {
  return (
    <div className="mx-auto max-w-[1536px] px-5 sm:px-8 lg:px-14 xl:px-16">
      <a href="#main" className="sr-only z-20 rounded-md bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4">Skip to the gallery</a>
      <header className="flex h-22 items-center justify-between gap-4 border-b border-line">
        <div className="flex items-center gap-3">
          <FrameIcon className="size-7 text-accent" />
          <span className="font-display text-[38px] leading-none tracking-[-0.06em]">still.</span>
          <span className="ml-3 hidden border-l border-line pl-5 text-[11px] text-muted sm:block">a little space to look closer</span>
        </div>
        <p className="flex items-center gap-2.5 text-[9px] font-medium tracking-[0.14em] text-muted uppercase sm:text-[10px]">
          <span className="size-1.5 rounded-full bg-[#78816b]" />
          A fresh perspective
        </p>
      </header>
      <main id="main" tabIndex={-1} className="outline-none">
        <Gallery />
      </main>
      <footer className="flex flex-col gap-4 border-t border-line py-7 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <FrameIcon className="size-4 text-accent" />
          <p>Made for the beauty in between.</p>
        </div>
        <p>Photography from <a href="https://picsum.photos" target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">Lorem Picsum <span aria-hidden="true">↗</span></a></p>
      </footer>
    </div>
  )
}
