import { useState, useCallback } from "react";

export default function useSubmit<T>(onSubmitFn: (values: T) => Promise<void>) {
  const [loading, setLoading] = useState(false);

  const handler = useCallback(
    async (values: T) => {
      try {
        setLoading(true);
        await onSubmitFn(values);
      } finally {
        setLoading(false);
      }
    },
    [onSubmitFn],
  );

  return { loading, handler };
}
