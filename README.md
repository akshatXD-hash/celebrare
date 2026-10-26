# Still

A small photo gallery built for the Celebrare frontend assignment. It loads 30 photographs from Picsum, filters them by photographer, and remembers the photos you heart.

## Run locally

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

```sh
npm test
npm run build
npm run preview
```

The production build is written to `dist`. It can be served by any static host. The app needs an internet connection for the Picsum API and images; the fonts are bundled locally.

## How it fits together

- `src/components/Gallery.jsx` ties the fetch hook, search and favourites together.
- `src/hooks/useFetchPhotos.js` fetches the collection and returns `photos`, `loading` and `error`. It checks HTTP errors, cancels requests on unmount and times out after 15 seconds.
- `src/reducers/favouritesReducer.js` handles one action, `toggle`. It adds an ID if it is missing and removes it if it is already saved.
- `src/components/PhotoCard.jsx` displays the image, author and accessible heart button.
- `src/components/SearchInput.jsx` is a memoized search field with a clear button.

Favourites are initialized from `localStorage` through the reducer's lazy initializer. An effect saves changes under `still-favourites`. Only photo IDs are stored. Malformed saved values fall back to an empty list; if writing is blocked, the gallery explains that favourites will only last for the current visit.

Search ignores case and surrounding spaces. It filters the fetched array and never makes another API request. `useCallback` keeps the search handler stable so the memoized search component can skip renders when favourites change. `useMemo` avoids re-filtering the photos on those same updates. Neither hook is necessary for correctness, and the performance benefit is small with 30 photos; they are used here as required by the brief.

Tailwind handles all styling. The grid has one column below 640px, two from 640px, and four from 1024px. There are no component libraries, accounts or extra browsing features.

## Checks

The test suite covers fetching, the loading state, HTTP and network failures, timeouts, request cleanup, search, favourite toggling and restoration, malformed or blocked storage, and broken images.

React Strict Mode is enabled. In development, React can start and cancel an initial request to check effect cleanup; this is expected. Searching never fetches again.

## Five-minute walkthrough

1. **0:00–1:00:** Show the collection, search for `Paul`, clear the search, heart a photo, and refresh to show it stays saved.
2. **1:00–2:00:** Open `useFetchPhotos.js`. Explain the three returned values, the HTTP check, the catch block and the cleanup function.
3. **2:00–3:00:** Open the reducer and its usage in `Gallery.jsx`. Walk through adding and removing an ID, lazy initialization, and the persistence effect.
4. **3:00–4:00:** Explain `handleSearch`, `filteredPhotos`, and the two performance hooks. Be clear that removing the memoization would not break the app.
5. **4:00–5:00:** Discuss a part you personally worked through and understand. One useful topic to study is why loading saved favourites in the reducer initializer prevents the first save effect from overwriting them with an empty array.

Record the explanation yourself after reviewing the code. The assignment asks for the public GitHub link, your recording link, and one line about the hardest part in the separately shared Google Form.
