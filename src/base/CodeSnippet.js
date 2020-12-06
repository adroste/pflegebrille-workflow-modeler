import Prism from 'prismjs';
import React from 'react';

export function CodeSnippet({
    language,
    children
}) {
    return (
        <pre className={`language-${language}`}>
            <code
                className={`language-${language}`}
                dangerouslySetInnerHTML={{
                    __html: Prism.highlight(children, Prism.languages[language], language),
                }}
            />
        </pre>
    );
}
