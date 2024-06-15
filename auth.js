const msal = require('@azure/msal-node');

const config = {
    auth: {
        clientId: "b58dfd89-441a-47ed-a66e-8479660dd9b2",
        authority: "https://login.microsoftonline.com/591556fb-2183-44c0-94da-579457272403",
        clientSecret: "kdu8Q~WaQ4QqICCEUvmCr5Pqm84IUAgpZ29p8bla"
    }
};

const cca = new msal.ConfidentialClientApplication(config);

const getAuthUrl = async () => {
    const authCodeUrlParameters = {
        scopes: ["user.read", "files.readwrite.all", "offline_access"],
        redirectUri: "http://localhost:3000/auth/callback",
        prompt: 'consent'
    };
    let temp = await cca.getAuthCodeUrl(authCodeUrlParameters);
    console.log(temp)
    return temp
}

const getToken = async (code) => {
    const tokenRequest = {
        code: code,
        scopes: ["user.read","files.write.all", "offline_access"],
        redirectUri: "http://localhost:3000/auth/callback",
        prompt: 'consent'
    };
    const response = await cca.acquireTokenByCode(tokenRequest);
    return response.accessToken
}

const refreshToken = async (refreshToken) => {
    const tokenRequest = {
        refreshToken: refreshToken,
        scopes: ["user.read", "files.readwrite.all", "offline_access"],
        prompt: 'consent'
    };
    const response = await cca.acquireTokenByRefreshToken(tokenRequest);
    return response;
};

module.exports = {getAuthUrl, getToken, refreshToken}