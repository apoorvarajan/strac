const express = require('express');
const axios = require('axios');
const { getClient } = require('./main');

const app = express()
app.use(express.json())

let tokenData = {
    accessToken: null,
    refreshToken: null,
    expiresOn: null
};

const subscribeWebHook = async(accesstoken) => {
    const client = getClient(accesstoken)
    const subscription = await client.api('/subscriptions').post({
        changeType: 'updated',
        notificationUrl: 'https://8c46-2601-180-8200-b4e0-5a7-7bd8-dae9-a353.ngrok-free.app/webhook',
        resource: '/me/drive/root',
        expirationDateTime: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
        clientState: 'secretClientValue'
    })
    return subscription;
}

const getAccessToken = async () => {
    if (tokenData.expiresOn && tokenData.expiresOn > new Date()) {
        return tokenData.accessToken;
    } else {
        const newTokenData = await refreshToken(tokenData.refreshToken);
        tokenData.accessToken = newTokenData.accessToken;
        tokenData.refreshToken = newTokenData.refreshToken;
        tokenData.expiresOn = new Date(newTokenData.expiresOn);
        return tokenData.accessToken;
    }
};

app.post('/webhook',(req,res)=>{
    if(req.query.validationToken){
        res.send(validationToken)
        return
    }
    const notifications = req.body.value;
    notifications.forEach(async (notification) => {
        console.log(notification);
        const { resource, clientState } = notification;
        if (clientState === 'kdu8Q~WaQ4QqICCEUvmCr5Pqm84IUAgpZ29p8bla') {
            const accessToken = await getAccessToken();

            const client = getClient(accessToken);
            const filePermissions = await client.api(resource).get();
            console.log('Updated file permissions:', filePermissions);
        }
    })
    res.status(202).end();
})

module.exports = { subscribeWebHook, app };
