import { useEffect, useState } from 'react'

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    const timeout = setTimeout(() => controller.abort(), 15000)

    async function fetchPhotos() {
      try {
        const response = await fetch('https://picsum.photos/v2/list?limit=30', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('The photo service is unavailable right now. Please try again in a moment.')
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('We couldn’t read the collection. Please try again.')
        }

        if (active) setPhotos(data)
      } catch (error) {
        if (active) {
          setError(error.name === 'AbortError'
            ? 'The photos took too long to arrive. Check your connection and try again.'
            : error instanceof TypeError
              ? 'We couldn’t load the photos. Check your connection and try again.'
              : error.message)
        }
      } finally {
        clearTimeout(timeout)
        if (active) setLoading(false)
      }
    }

    fetchPhotos()

    return () => {
      active = false
      clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return { photos, loading, error }
}
