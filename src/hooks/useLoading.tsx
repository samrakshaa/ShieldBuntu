import { useState, useCallback } from 'react';

type UseLoadingHookParams<T> = {
    functionToExecute: () => T | Promise<T>;
    onSuccess?: (result: T) => void;
    onError?: (error: any) => void;
};

type UseLoadingHookReturn<T> = {
    isLoading: boolean;
    result: T | null;
    error: any;
    execute: () => void;
};

function useLoading<T>(params: UseLoadingHookParams<T>): UseLoadingHookReturn<T> {
    const { functionToExecute, onSuccess, onError } = params;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);

    const execute = useCallback(() => {
        setIsLoading(true);
        setResult(null);
        setError(null);

        // Wrapping the execution in a Promise to handle both sync and async functions
        Promise.resolve().then(() => functionToExecute())
            .then(response => {
                setResult(response);
                if (onSuccess) {
                    onSuccess(response);
                }
            })
            .catch(err => {
                setError(err);
                if (onError) {
                    onError(err);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [functionToExecute, onSuccess, onError]);

    return { isLoading, result, error, execute };
}

export default useLoading;
