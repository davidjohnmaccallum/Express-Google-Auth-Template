# Express Google Auth Template

Implements [Google OAuth2](https://developers.google.com/identity/protocols/oauth2/openid-connect) login using [google-api-nodejs-client](https://github.com/googleapis/google-api-nodejs-client) ([reference docs](https://googleapis.dev/nodejs/googleapis/latest/)). I got help from [this](https://dev.to/aidanlovelace/how-to-setup-google-oauth2-login-with-express-2d30) article.

## Getting Started

Open the [Google Developer Console](https://console.cloud.google.com/) and register a project.

Go to APIs & Services.

Enable the APIs you require. This example uses the YouTube API.

Setup the OAuth consent screen.
* Don't set an image yet. This will trigger the validation process which takes a long time.

Go to Credentials and Create an OAuth Client ID.
* Set Authorised JavaScript origins to http://localhost:3000
* Set Authorised redirect URIs to http://localhost:3000/oauth/callback
* Make a note of the Client ID, Client Secret and Redirect URL.
* Set the following environment variables: OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_UR

We will store the access token in a JWT stored in a cookie in the users browser.
* Set the following environment variable: JWT_SECRET

