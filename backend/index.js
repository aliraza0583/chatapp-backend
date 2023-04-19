import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import twilio from 'twilio';
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const client = twilio(
  'ACd24519f5d0296c627cf16abaa06a0fbb',
  'c8b809d8850dcc2e49d8c5b98fdd66fd',
);

const app = express();
// app.use(cors({origin: '*', credentials: true}));
app.use(cors());

app.get('/call', (req, res) => {
  client.calls
    .create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: req?.query?.to || '+923234459495',
      from: '+16204009508',
    })
    .then(call => {
      res.send({data: call?.sid});
    });
});

app.get('/cancel', async (req, res) => {
  await client.calls(req?.query?.sid).update({status: 'canceled'});
  res.send('Cancelled successfully');
});

app.get('/getToken', (req, res) => {
  if (!req.query || !req.query.userName) {
    return res.status(400).send('Username parameter is required');
  }
  const accessToken = new AccessToken(
    process.env.ACCOUNT_SID,
    process.env.API_KEY_SID,
    process.env.API_KEY_SECRET,
  );

  // Set the Identity of this token
  accessToken.identity = req.query.userName;

  // Grant access to Video
  var grant = new VideoGrant();
  accessToken.addGrant(grant);

  // Serialize the token as a JWT
  var jwt = accessToken.toJwt();
  return res.send(jwt);
});

app.listen(8000, () => console.log(`Server listening on port ${8000}!`));
