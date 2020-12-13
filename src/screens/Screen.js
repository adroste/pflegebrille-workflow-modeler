import React from 'react';
import styles from './Screen.module.css';

export function Screen({ children }) {
    return (
        <div className={styles.wrapper}>
            {children}
        </div>
    );
}