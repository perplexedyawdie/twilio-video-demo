import twilio from 'twilio';
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

if (!process.env.TWILIO_API_KEY_SID) {
    throw new Error("API Key SID env var not found");
}

if (!process.env.TWILIO_API_KEY_SECRET) {
    throw new Error("API Key Secret env var not found"); 
}

if (!process.env.TWILIO_ACCOUNT_SID) {
    throw new Error("Account SID env var not found");
}

const twilioClient = twilio(
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

export {
    twilioClient,
    AccessToken,
    VideoGrant 
} 
