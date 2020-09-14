const express = require('express')
const {google} = require('googleapis');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express()

app.use(cookieParser(null, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
}));

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
}

// generate a url that asks permissions for the YouTube data API
const scopes = [
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

app.get('/', async (req, res, next) => {
  try {    
    if (!req.cookies.jwt) {
      // We haven't logged in
      return res.redirect('/oauth');
    }
    const oauth2Client = new google.auth.OAuth2(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      process.env.OAUTH_REDIRECT_URL
    );
    oauth2Client.credentials = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    // Get the youtube service
    const service = google.youtube('v3');
    // Get five of the user's subscriptions (the channels they're subscribed to)
    const gres = await service.subscriptions.list({
      auth: oauth2Client,
      mine: true,
      part: 'snippet,contentDetails',
      maxResults: 5
    })
    // Render the data view, passing the subscriptions to it
    return res.send(gres.data)
  } catch(err) {
    next(err)
  }
})

app.get('/oauth', (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URL
  );
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    // access_type: 'offline',
  
    // If you only need one scope you can pass it as a string
    scope: scopes    
  })
  console.log('Redirecting to consent page', url)
  res.redirect(url)
})

app.get('/oauth/callback', async (req, res, next) => {
  console.log('OAuth callback', req.query)
  try {
    if (req.query.error) {
      // The user did not give us permission.
      return res.redirect('/')
    } else {
      // This will provide an object with the access_token and refresh_token.
      // Save these somewhere safe so they can be used at a later time.
      const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET,
        process.env.OAUTH_REDIRECT_URL
      );
      const {tokens} = await oauth2Client.getToken(req.query.code)
      console.log('Tokens', tokens)
      res.cookie('jwt', jwt.sign(tokens, process.env.JWT_SECRET), cookieOptions)
      res.redirect('/')  
    }
  } catch(err) {
    next(err)
  }
})

app.listen(3000, err => {
  if (err) return console.log('Error', err)
  console.log('Listening on 3000')
})