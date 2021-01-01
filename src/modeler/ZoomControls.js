import { BorderOuterOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import React, { useCallback, useContext } from 'react';

import { Button } from 'antd';
import { modelerContext } from './ModelerContextProvider';

export function ZoomControls() {
    const { editorActions, backgroundGrid } = useContext(modelerContext);

    const handleZoomIn = useCallback(() => {
        editorActions.trigger('stepZoom', { value: 1 });
    }, [editorActions]);

    const handleZoomOut = useCallback(() => {
        editorActions.trigger('stepZoom', { value: -1 });
    }, [editorActions]);

    const handleGrid = useCallback(() => {
        backgroundGrid.setVisible(!backgroundGrid.isVisible());
    }, [backgroundGrid]);
    
    return (
        <div>
            <Button
                icon={<ZoomOutOutlined />}
                onClick={handleZoomOut}
                shape='circle'
                title='Zoom -'
            />
            &nbsp;
            <Button
                icon={<ZoomInOutlined />}
                onClick={handleZoomIn}
                shape='circle'
                title='Zoom +'
            />
            &nbsp;
            <Button
                icon={<BorderOuterOutlined />}
                onClick={handleGrid}
                shape='circle'
                title='Grid aktivieren/deaktivieren'
            />
        </div>
    );
}