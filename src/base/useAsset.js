import { appContext } from './AppContextProvider';
import { useContext } from 'react';
import { useMemo } from 'react';

export function useAsset(assetUrl) {
    const { assets } = useContext(appContext);

    return useMemo(() => {
        if (!assetUrl?.startsWith('asset:'))
            return null;

        const path = assetUrl.split(':')[1];
        return assets[path];
    }, [assetUrl, assets]);
}