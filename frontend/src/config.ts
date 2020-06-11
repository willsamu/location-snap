const region = 'eu-central-1'
const apiId = 'XXXXXXXXXX' // TODO: insert your API id
const hostingUrl = 'http://localhost:3000'
const stage = process.env.STAGE || 'dev'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`

export const authConfig = {
  domain: 'YOURDOMAIN.eu.auth0.com', // TODO: insert your Auth0 domain
  clientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // TODO: insert  your Auth0 client id
  callbackUrl: `${hostingUrl}/callback`,
  websiteDomain: `${hostingUrl}`,
}

export const reactPassword = 'password' // TODO: Insert Desired Password to lock the application
