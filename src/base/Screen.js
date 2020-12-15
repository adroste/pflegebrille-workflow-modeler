import React from 'react';
import styles from './Screen.module.css';

export function Screen({ 
    children,
    className,
}) {
    return (
        <div className={`${styles.wrapper} ${className}`}>
            {children}
        </div>
    );
}