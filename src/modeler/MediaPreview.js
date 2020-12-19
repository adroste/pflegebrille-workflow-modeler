import React, { useContext } from 'react';

import { Result } from 'antd';
import { appContext } from '../base/AppContextProvider';
import styles from './MediaPreview.module.css';
import { useObjectUrl } from './useObjectUrl';

export function MediaPreview({ id }) {
    const { assetData } = useContext(appContext);
    const assetDatum = assetData[id];
    const assetUrl = useObjectUrl(assetDatum);

    if (!assetDatum)
        return (
            <div className={styles.preview}>
                <Result
                    status="warning"
                    subTitle="Asset wurde nicht gefunden"
                />
            </div>
        );

    return (
        <div className={styles.preview}>
            {assetDatum.type.startsWith('image') &&
                <img
                    src={assetUrl}
                    alt=""
                />
            }

            {assetDatum.type.startsWith('video') &&
                <video
                    src={assetUrl}
                    controls
                />
            }
        </div>
    );
}