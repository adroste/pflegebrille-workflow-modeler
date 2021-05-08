import { getWorkflowRegistryUrl, pathJoin } from './util';

export const getWorkflowListApi = {
    url: pathJoin(getWorkflowRegistryUrl(), 'list'),
}

export const getPackageListForWorkflowApi = {
    url: pathJoin(getWorkflowRegistryUrl(), 'list', ':workflow'),
};

export const downloadWorkflowApi = {
    url: pathJoin(getWorkflowRegistryUrl(), 'download', ':workflow', ':filename'),
    responseDataMethod: 'blob',
};