import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const defaultSetFunc = ({ res }) => res;

export function useApi(
    {
        url,
        method = 'GET',
        // res must return new state
        // signature: ({ cur, params, req, res }) => updatedData
        setFunc = defaultSetFunc,
        responseDataMethod = 'json', // can also be blob, text, ...
    },
    // setData is called in any case after fetch was successful
    // even if call was cancelled 
    setData,
    // autoFetch can be boolean or object like { reqParams, reqData }
    // will trigger refetch when instance changes
    autoFetch = false,
) {
    const [success, setSuccess] = useState(false);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(!!autoFetch);
    const [error, setError] = useState(null);
    const lastCallRef = useRef(null);

    // reqParams like { query: { example: 1 }, path: { id: 4 }}
    const call = useCallback((reqParams, reqData, successCallback) => {
        if (lastCallRef.current)
            lastCallRef.current.cancel();

        let cancelled = false;

        const doFetch = async () => {
            setSuccess(false);
            setStatus(null);
            setLoading(true);
            try {
                let parameterizedUrl = Object.keys(reqParams?.path || {})
                    .reduce((acc, param) => acc.replace(`:${param}`, reqParams.path[param]), url);
                const queryString = Object.keys(reqParams?.query || {})
                    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(reqParams.query[key])}`)
                    .join('&');
                if (queryString)
                    parameterizedUrl += `?${queryString}`;
                
                const headers = {};
                if (reqData)
                    headers['Content-Type'] = 'application/json';
                
                if (cancelled) 
                    return;

                const response = await fetch(parameterizedUrl, {
                    method,
                    headers,
                    body: reqData ? JSON.stringify(reqData) : undefined,
                });

                if (!cancelled)
                    setStatus(response.status);

                const resData = await response[responseDataMethod]();

                if (response.ok) {
                    if (setData)
                        setData(cur => setFunc({
                            cur, 
                            params: reqParams,
                            req: reqData, 
                            res: resData,
                        }));
                    if (!cancelled) {
                        setSuccess(true);
                        if (successCallback)
                            successCallback();
                    }
                } else {
                    if (!cancelled)
                        setError(resData);
                }
            } catch (err) {
                if (!cancelled)
                    setError(err);
            } finally {
                if (!cancelled)
                    setLoading(false);
            }
        };

        const task = doFetch();
        task.cancel = () => cancelled = true;
        lastCallRef.current = task;
        return task.cancel;
    }, [
        method,
        responseDataMethod,
        setData,
        setFunc,
        url,
    ]);

    useEffect(() => {
        if (autoFetch)
            call(autoFetch?.reqParams, autoFetch?.reqData);
    }, [autoFetch, call])

    useEffect(() => {
        return () => lastCallRef.current?.cancel?.();
    }, []);

    return useMemo(() => ([
        {
            success,
            loading,
            error,
            status,
        },
        call, // see hint at top of file
    ]), [
        success,
        loading,
        error,
        status,
        call,
    ]);
}