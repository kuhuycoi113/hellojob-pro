import { useState, useCallback } from "react";

type UseLoadingCallbackReturn<T extends (...args: any[]) => Promise<any>> = [
  (...args: Parameters<T>) => Promise<ReturnType<T>>,
  boolean,
  any
];

export function useLoadingCallback<T extends (...args: any[]) => Promise<any>>(
  callback: T
): UseLoadingCallbackReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const wrapped = useCallback(
    async (...args: Parameters<T>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await callback(...args);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [callback]
  );

  return [wrapped, loading, error];
}
