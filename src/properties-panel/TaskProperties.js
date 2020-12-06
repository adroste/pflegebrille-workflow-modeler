import { ManualTaskProperties } from './ManualTaskProperties';
import React from 'react';
import { is } from 'bpmn-js/lib/util/ModelUtil';

export function TaskProperties({
    element,
}) {
    if (is(element, 'bpmn:ManualTask'))
        return <ManualTaskProperties element={element} />

    return null;
}
