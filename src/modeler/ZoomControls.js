import React, { useCallback, useContext } from 'react';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';

import { Button } from 'antd';
import { modelerContext } from './ModelerContextProvider';

export function ZoomControls() {
    const { editorActions } = useContext(modelerContext);

    const handleZoomIn = useCallback(() => {
        editorActions.trigger('stepZoom', { value: 1 });
    }, [editorActions]);

    const handleZoomOut = useCallback(() => {
        editorActions.trigger('stepZoom', { value: -1 });
    }, [editorActions]);
    
    return (
        <div>
            <Button
                icon={<ZoomOutOutlined />}
                onClick={handleZoomOut}
                shape='circle'
            />
            &nbsp;
            <Button
                icon={<ZoomInOutlined />}
                onClick={handleZoomIn}
                shape='circle'
            />
        </div>
    );
}