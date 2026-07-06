import { useCallback, useEffect, useState } from 'react'

/**
 * Generic fetch hook. Pass a stable async function (usually wrapped in
 * useCallback by the caller) and this handles loading/error/data state,
 * plus a `refetch` you can call after mutations.
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    load()
  }, [load])

  return { data, error, isLoading, refetch: load, setData }
}
