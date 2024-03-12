const express = require('express')

const fetch = require('node-fetch');
const app = express();
const port =  3000;


const spotifyConfig = {
    clientID:'27fe7abc5e5944d6be638c0fed9b3eed',
    clientSecret: 'b6a494f0ffbc4497a2ec4e1507bea119',
    redirectURI: 'zekiexperts.com'
  };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})


app.post('/token', async (req, res) => {
    const { code } = req.body;
  
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${spotifyConfig.clientID}:${spotifyConfig.clientSecret}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: spotifyConfig.redirectURI
        })
      });
  
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error in token swap:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Token Refresh Endpoint
  app.post('/refresh_token', async (req, res) => {
    const { refresh_token } = req.body;
  
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${spotifyConfig.clientID}:${spotifyConfig.clientSecret}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refresh_token
        })
      });
  
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error in token refresh:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
app.listen( 3000)