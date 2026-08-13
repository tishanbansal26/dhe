import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * A custom hook for fetching data from Supabase with loading, error, and refetch states.
 * @param {Function} queryFn - An async function that executes the Supabase query.
 * @param {Array} dependencies - Array of dependencies to re-trigger the query.
 * @param {Object} options - Configuration options (e.g., onError, onSuccess, initialData).
 */
export function useSupabaseQuery(queryFn, dependencies = [], options = {}) {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      if (result.error) throw result.error;
      setData(result.data);
      if (options.onSuccess) options.onSuccess(result.data);
    } catch (err) {
      console.error('Supabase Query Error:', err);
      setError(err);
      if (options.onError) {
        options.onError(err);
      } else {
        toast.error('Failed to load data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, setData };
}
