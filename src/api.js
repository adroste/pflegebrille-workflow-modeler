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

export const uploadWorkflowApi = {
    url: pathJoin(getWorkflowRegistryUrl(), 'upload', ':workflow', ':version'),
    method: 'POST',
    // headers: { 'Content-Type': 'multipart/form-data' },
    requestDataTransform: zipBlob => {
        const formData = new FormData()
        formData.append('file', zipBlob, 'file.zip');
        return formData;
    },
};