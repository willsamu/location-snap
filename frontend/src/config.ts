// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const region = 'eu-central-1'
const apiId = 'jmd5vc6zo5'
const stage = process.env.STAGE || 'dev'
// export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`
export const apiEndpoint = `https://jmd5vc6zo5.execute-api.eu-central-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'lambda-todo.eu.auth0.com', // Auth0 domain
  //  clientId: 'yxC2Fn7F3qfKmH06E8c8Hjggbny70O9J', // Auth0 client id
  clientId: 'S7JxpDEwiqVTYQxFjaSaYHLutl3w7bV5', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback',
  websiteDomain: 'http://localhost:3000',
}
