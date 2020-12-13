import { Alert } from 'antd';
import React from 'react';
import { RuleCategoryEnum } from '../meta-model/enum/RuleCategoryEnum';
import styles from './IssueList.module.css';

const categoryMap = {
    [RuleCategoryEnum.WARN]: 'warning',
    [RuleCategoryEnum.ERROR]: 'error',
}

export function IssueList({ issues }) {

    if (
        (typeof issues?.map !== 'function')
        || issues?.length === 0
    ) {
        return null;
    }
    
    return (
        <div className={styles.wrapper}>
            {issues.map(({ category, message }) => (
                <Alert
                    banner
                    key={message}
                    message={message}
                    type={categoryMap[category]}
                    showIcon
                />
            ))}
        </div>
    );
}