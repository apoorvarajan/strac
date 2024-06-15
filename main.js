const {Client} = require('@microsoft/microsoft-graph-client')
require('isomorphic-fetch')

const getClient = (accessToken) => {
    return Client,init({
        authProvider: (done) => {
            done(null, accessToken)
        }
    })
}

const listFiles = async(accessToken) => {
    const client = getClient(accessToken);
    const files = await client.api('/me/drive/root/children').get()
    return files.value
}

const downloadFile = async(accessToken, fileId)=>{
    const client = getClient(accessToken)
    const file = await client.api(`/me/drive/items/${fileId}`).get();
    return file;
}

const listFilePermissions = async(accessToken,fileId) => {
    const client = getClient(accessToken);
    const permissions = await client.api(`/me/drive/items/${fileId}/permissions`).get();
    return permissions.value;
}

module.exports = { listFiles, downloadFile, listFilePermissions };