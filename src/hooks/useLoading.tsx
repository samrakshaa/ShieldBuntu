import { useState, useCallback } from 'react';

type UseLoadingHookParams<T, Args extends any[]> = {
    functionToExecute: (...args: Args) => T | Promise<T>;
    onSuccess?: (result: T) => void;
    onError?: (error: any) => void;
};

type UseLoadingHookReturn<T, Args extends any[]> = {
    isLoading: boolean;
    result: T | null;
    error: any;
    execute: (...args: Args) => void;
};

function useLoading<T, Args extends any[] = []>(params: UseLoadingHookParams<T, Args>): UseLoadingHookReturn<T, Args> {
    const { functionToExecute, onSuccess, onError } = params;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);

    const execute = useCallback((...args: Args) => {
        setIsLoading(true);
        setResult(null);
        setError(null);

        Promise.resolve().then(() => functionToExecute(...args))
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
