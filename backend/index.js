import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import twilio from 'twilio';
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const VoiceResponse = twilio.twiml.VoiceResponse;
const VoiceGrant = AccessToken.VoiceGrant;

let identity;

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/api/token', (req, res) => {
  console.log('tokennnnnnnnnn api ');
  identity = '+16204009508';
  const accessToken = new AccessToken(
    'ACd24519f5d0296c627cf16abaa06a0fbb', //  twilioCredentials.ACCOUNT_SID,
    'SK9dc819726084e2baff1405ac785f21ec', //twilioCredentials.API_KEY_SID,
    'KD8dYT2j5asUhTlXttky2bPe0EsxfUBW', //  twilioCredentials.API_KEY_SECRET,
    {identity: identity},
  );
  const grant = new VoiceGrant({
    outgoingApplicationSid: 'APcca314f97e78dc7603dd804bbc037e3a', // twilioCredentials.OUTGOING_APPLICATION_SID,
    incomingAllow: true,
  });
  accessToken.addGrant(grant);

  // Include identity and token in a JSON response
  return res.send({
    identity: identity,
    token: accessToken.toJwt(),
  });
});

app.post('/api/voice', (req, res) => {
  const toNumberOrClientName = req.body.To;
  const callerId = '+16204009508';
  let twiml = new VoiceResponse();

  // If the request to the /voice endpoint is TO your Twilio Number,
  // then it is an incoming call towards your Twilio.Device.
  if (toNumberOrClientName == callerId) {
    console.log('incoming call');
    //   let dial = twiml.dial();
    //   // This will connect the caller with your Twilio.Device/client
    //   dial.client(identity);
  } else if (req.body.To) {
    console.log('outgoing call');
    // This is an outgoing call

    // set the callerId
    let dial = twiml.dial({callerId});
    // let dial = twiml.dial({callerId: '+923234459495'});

    // Check if the 'To' parameter is a Phone Number or Client Name
    // in order to use the appropriate TwiML noun
    const attr = isAValidPhoneNumber(toNumberOrClientName)
      ? 'number'
      : 'client';
    dial[attr]({}, toNumberOrClientName);
    // } else {
    //   twiml.say('Thanks for calling!');
  }
  return res.send(twiml.toString());
});
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}

app.get('/token', (req, res) => {
  const AccessToken = twilio.jwt.AccessToken;
  const token = new AccessToken(
    'ACb6f363290a8f8ea39944f575c2543ae8',
    'SK2a6332c3edf075172eda80e76706de81',
    '58E0R4oHQdzGO1xTHJDPD6iqBIWkUvIT',
    {identity: 'example-user'},
  );
  res.send({token: token});
});

app.get('/call', (req, res) => {
  client.calls
    .create({
      // url: 'https://handler.twilio.com/twiml/EHfb4a68b717decc4ae26bd81879baab56',
      // twiml: '<Response><Dial>+9230000000</Dial></Response>',
      twiml:
        '<Response><Dial><Number>' +
        '+923234459495' +
        '</Number></Dial></Response>',
      to: req?.query?.to || '+923234459495',
      from: process?.env?.TWILIO_FROM_PHONE,
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
