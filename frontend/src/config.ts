const region = 'eu-central-1'
const apiId = 'z291zzopbe'
const stage = process.env.STAGE || 'dev'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`

export const authConfig = {
  domain: 'lambda-todo.eu.auth0.com', // Auth0 domain
  clientId: 'yxC2Fn7F3qfKmH06E8c8Hjggbny70O9J', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback',
  websiteDomain: 'http://localhost:3000',
}
