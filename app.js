const express = require('express');
const { getAuthUrl, getToken } = require('./auth');
const { listFiles, downloadFile, listFilePermissions } = require('./main');
const { subscribeWebhook, app: webhookApp } = require('./webhook');

const app = express();

app.get('/auth', async (req, res) => {
    try {
        const authUrl = await getAuthUrl();
        res.redirect(authUrl);
    } catch (error) {
        res.status(500).send('Error generating auth URL');
    }
});

app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    const accessToken = await getToken(code);
    await subscribeWebhook(accessToken);
    res.send('Authenticated and webhook subscribed');
});

app.get('/files', async (req, res) => {
    const accessToken = req.headers['authorization'];
    const files = await listFiles(accessToken);
    res.json(files);
});

app.get('/files/:id/download', async (req, res) => {
    const accessToken = req.headers['authorization'];
    const fileId = req.params.id;
    const file = await downloadFile(accessToken, fileId);
    res.json(file);
});

app.get('/files/:id/permissions', async (req, res) => {
    const accessToken = req.headers['authorization'];
    const fileId = req.params.id;
    const permissions = await listFilePermissions(accessToken, fileId);
    res.json(permissions);
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

webhookApp.listen(3001, () => {
    console.log('Webhook server started on http://localhost:3001');
});