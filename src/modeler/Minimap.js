import { CloseOutlined, ExpandOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useState } from 'react';

import { Button } from 'antd';
import { modelerContext } from './ModelerContextProvider';
import styles from './Minimap.module.css';

export function Minimap() {
    const { minimap } = useContext(modelerContext);
    const [open, setOpen] = useState(false);

    const handleToggle = useCallback(() => {
        setOpen(open => {
            if (open)
                minimap.close();
            else
                minimap.open();
            return !open;
        });
    }, [minimap]);
    
    return (
        <div className={styles.button}>
            <Button
                icon={open ? <CloseOutlined /> : <ExpandOutlined />}
                onClick={handleToggle}
                type={open ? 'text' : 'default'}
            >
                {open ? 'schließen' : 'Minimap'}
            </Button>
        </div>
    );
}