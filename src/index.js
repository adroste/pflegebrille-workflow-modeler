import 'antd/dist/antd.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css';
import 'prismjs/themes/prism.css';
import './index.css';

import * as serviceWorker from './serviceWorker';

import App from './base/App';
import { AppContextProvider } from './base/AppContextProvider';
import { ConfigProvider } from 'antd';
import { ModelerContextProvider } from './modeler/ModelerContextProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import locale from 'antd/lib/locale/de_DE';

if (process.env.NODE_ENV === 'development') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    whyDidYouRender(React, {
        trackAllPureComponents: true,
    });
}

ReactDOM.render(
    <ConfigProvider locale={locale}>
        <AppContextProvider>
            <ModelerContextProvider>
                <App />
            </ModelerContextProvider>
        </AppContextProvider>
    </ConfigProvider>,
    document.getElementById('app')
);

// disabled due to ant.d usage of findDomNode
// ReactDOM.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>,
//     document.getElementById('app')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
