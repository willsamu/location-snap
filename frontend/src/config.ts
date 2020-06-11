const region = 'eu-central-1'
const apiId = 'z291zzopbe'
const hostingUrl = 'https://d2ovsmn4ut11iq.cloudfront.net'
const stage = process.env.STAGE || 'dev'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}` // TODO: add stage

export const authConfig = {
  domain: 'lambda-todo.eu.auth0.com', // Auth0 domain
  clientId: 'yxC2Fn7F3qfKmH06E8c8Hjggbny70O9J', // Auth0 client id
  callbackUrl: `${hostingUrl}/callback`,
  websiteDomain: `${hostingUrl}`,
}
