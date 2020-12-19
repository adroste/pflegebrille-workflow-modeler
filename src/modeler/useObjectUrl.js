import { useEffect, useState } from 'react';

export function useObjectUrl(blob) {
    const [objectUrl, setObjectUrl] = useState(null);

    useEffect(() => {
        if (!blob)
            return;
        const objectUrl = URL.createObjectURL(blob);
        setObjectUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [blob]);

    return objectUrl;
}