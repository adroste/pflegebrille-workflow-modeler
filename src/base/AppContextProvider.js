import React, { useCallback, useMemo, useState } from 'react';

import JSZip from 'jszip';
import { ScreenEnum } from './ScreenEnum';

export const appContext = React.createContext();

export function AppContextProvider({
    children,
}) {
    const [initialXml, setInitialXml] = useState();
    const [assets, setAssets] = useState();
    const [screen, setScreen] = useState(ScreenEnum.LOAD_WORKFLOW);

    const exportWorkflow = useCallback(async (xml) => {
        const assetList = Object.values(assets);

        const metadata = {
            xmlPath: 'workflow.bpmn',
            createdAt: Date.now(),
            assets: assetList.map(({ name, path, type }) => ({
                name,
                path,
                type,
            })),
        };

        const zip = new JSZip();
        zip.file('workflow.bpmn', xml);
        zip.file('metadata.json', JSON.stringify(metadata, null, 4));
        assetList.forEach(({ path, blob }) => {
            zip.file(path, blob);
        });

        const zipBlob = zip.generateAsync({ type: 'blob' });
        return zipBlob;
    }, [assets]);

    const importWorkflow = useCallback(async ({ isZip, data }) => {
        let xml;
        let assets = {};

        if (isZip) {
            const zip = new JSZip();
            await zip.loadAsync(data);

            const metadataFile = zip.file('metadata.json');
            if (!metadataFile)
                throw new Error('metadata.json nicht gefunden');
            let metadata = await metadataFile.async('string');
            metadata = JSON.parse(metadata);

            const xmlFile = zip.file(metadata.xmlPath);
            if (!xmlFile)
                throw new Error('XML/BPMN nicht gefunden');
            xml = await xmlFile.async('string');

            for (let asset of metadata.assets) {
                const assetFile = await zip.file(asset.path);
                if (!assetFile)
                    throw new Error('assets unvollständig oder beschädigt.');

                const blob = await assetFile.async('blob');
                const objectUrl = URL.createObjectURL(blob);

                assets[asset.path] = {
                    ...asset,
                    blob,
                    objectUrl,
                }
            }
        } else {
            xml = data;
        }

        if (!xml?.includes('bpmn:definitions'))
            throw new Error('BPMN-Datei ist beschädigt.');

        setAssets(assets);
        setInitialXml(xml);
    }, [setAssets]);

    const value = useMemo(() => ({
        assets,
        exportWorkflow,
        importWorkflow,
        initialXml,
        screen,
        setAssets,
        setInitialXml,
        setScreen,
    }), [assets, exportWorkflow, importWorkflow, initialXml, screen]);

    return (
        <appContext.Provider value={value}>
            {children}
        </appContext.Provider>
    );
}
