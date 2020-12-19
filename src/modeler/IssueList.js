import { Alert } from 'antd';
import React from 'react';
import { RuleCategoryEnum } from '../meta-model/enum/RuleCategoryEnum';
import styles from './IssueList.module.css';

const categoryMap = {
    [RuleCategoryEnum.WARN]: 'warning',
    [RuleCategoryEnum.ERROR]: 'error',
}

export function IssueList({ 
    className,
    issues ,
}) {

    if (
        (typeof issues?.map !== 'function')
        || issues?.length === 0
    ) {
        return null;
    }

    return (
        <div className={`${styles.wrapper} ${className}`}>
            {issues.map(({ category, message }, i) => (
                <Alert
                    banner
                    key={`${message}___${i}`}
                    message={message}
                    type={categoryMap[category]}
                    showIcon
                />
            ))}
        </div>
    );
}