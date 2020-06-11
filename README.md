# location-snap

Project Integrating Location based picture posting and Viewing.

# Demo

A private Demo of the running application can be found [here](https://d2ovsmn4ut11iq.cloudfront.net/). Please contact me for the password.

# Setup

```
git clone BLABLA
```

## Backend

**NOTE:** Deploying this configuration will create resources on AWS which will charge your account.

Signup at [Auth0](https://auth0.com/) and create an application with an RS256 encrypted signature.

Replace jwksUrl in `src/lambda/auth/auth0Authorizer.ts` with your Auth0JSON Web Key Set.

Install and setup [Serverless for usage with AWS](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/).

```
cd backend && yarn
```

Open serverless.yaml and Comment/Remove Entity `RDSCluser` (line 222 - 236).

```
sls deploy
```

This deploys the Cloudformation stack to AWS, not including the Aurora Cluster. Alternatively run `sls deploy --stage {desiredStageName}` to select a different stage.

Open AWS Console -> Secrets Manager, select `snap-rds-key-{stage}`, and insert a username & password for the Cluster:

```json
{
  "username": "myUsername",
  "password": "mySecurePassword"
}
```

Uncomment/Add the `RDSCluster` again.

Finally and for further deploys, run `sls deploy` again.

## Frontend

```
cd frontend && yarn
```

Edit the `config.ts` file with the apiId provided from serverless, and the region you've used for deployment (default `eu-central-1`).

Populate `authConfig.domain` and `authConfig.clienId` with your Auth0 App resources.

Add the url `{hostingUrl}/callback` as valid callback url in the Auth0 Console.

Optionally set another `reactPassword` which blocks the page content from public access.

```
yarn start
```
