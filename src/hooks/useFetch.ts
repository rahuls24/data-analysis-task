import { useState, useEffect, useCallback, useRef } from 'react';

interface FetchOptions extends RequestInit {
	skip?: boolean;
}

type FetchState<T> = {
	data: T | null;
	error: string | null;
	loading: boolean;
};

function useFetch<T = unknown>(url: string, options?: FetchOptions) {
	const [fetchState, setFetchState] = useState<FetchState<T>>({
		data: null,
		error: null,
		loading: false,
	});

	const abortControllerRef = useRef<AbortController | null>(null);

	const fetchData = useCallback(async () => {
		if (options?.skip) return;

		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		const abortController = new AbortController();
		abortControllerRef.current = abortController;
		const { signal } = abortController;

		setFetchState({ data: null, error: null, loading: true });

		try {
			const response = await fetch(url, { ...options, signal });
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}

			const data: T = await response.json();
			setFetchState({ data, error: null, loading: false });
		} catch (error) {
			if (signal.aborted) {
				// Do not do anything
				console.log('Fetch aborted');
			} else {
				setFetchState({
					data: null,
					error: (error as Error).message,
					loading: false,
				});
			}
		}
	}, [url, options]);

	useEffect(() => {
		fetchData();
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [fetchData]);

	return { ...fetchState, refetch: fetchData };
}

export default useFetch;
