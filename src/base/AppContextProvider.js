import React, { useCallback, useMemo, useState } from 'react';

import JSZip from 'jszip';
import { ScreenEnum } from './ScreenEnum';

export const appContext = React.createContext();

export function AppContextProvider({
    children,
}) {
    const [initialXml, setInitialXml] = useState();
    const [assetData, setAssetData] = useState();
    const [screen, setScreen] = useState(ScreenEnum.LOAD_WORKFLOW);

    const exportWorkflow = useCallback(async (xml) => {
        const zip = new JSZip();
        zip.file('workflow.bpmn', xml);

        const assetPaths = Object.keys(assetData);
        assetPaths.forEach(path => {
            zip.file(path, assetData[path]);
        });

        const zipBlob = zip.generateAsync({ type: 'blob' });
        return zipBlob;
    }, [assetData]);

    const importWorkflow = useCallback(async ({ isZip, data }) => {
        let xml;
        let assetData = {};

        if (isZip) {
            const zip = new JSZip();
            await zip.loadAsync(data);

            const xmlFile = zip.file(/(.xml|.bpmn)$/)[0];
            if (!xmlFile)
                throw new Error('XML/BPMN nicht gefunden');
            xml = await xmlFile.async('string');

            const assetsFolder = zip.folder('assets');
            const assetFiles = [];
            assetsFolder.forEach((path, zipFile) => {
                assetFiles.push({ path, zipFile });
            });
            for (let asset of assetFiles) {
                const { path, zipFile } = asset;
                assetData[path] = await zipFile.async('blob');
            }
        } else {
            xml = data;
        }

        if (!xml?.includes('bpmn:definitions'))
            throw new Error('BPMN-Datei ist beschädigt.');

        setAssetData(assetData);
        setInitialXml(xml);
    }, []);

    const value = useMemo(() => ({
        assetData,
        exportWorkflow,
        importWorkflow,
        initialXml,
        screen,
        setAssetData,
        setInitialXml,
        setScreen,
    }), [assetData, exportWorkflow, importWorkflow, initialXml, screen]);

    return (
        <appContext.Provider value={value}>
            {children}
        </appContext.Provider>
    );
}
