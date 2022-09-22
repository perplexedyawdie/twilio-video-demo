// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { twilioClient, AccessToken, VideoGrant } from '../../helper/twilioClient';
import { v4 as uuidv4 } from 'uuid';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json({ name: 'John Doe' })
}

async function findOrCreateRoom(roomName: string) {
    try {
      // see if the room exists already. If it doesn't, this will throw
      // error 20404.
      await twilioClient.video.rooms(roomName).fetch();
    } catch (error: any) {
      // the room was not found, so create it
      if (error.code == 20404) {
        await twilioClient.video.rooms.create({
          uniqueName: roomName,
          type: "go",
        });
      } else {
        // let other errors bubble up
        throw error;
      }
    }
  };

  function getAccessToken(roomName: string) {
    // create an access token
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY_SID!,
      process.env.TWILIO_API_KEY_SECRET!,
      // generate a random unique identity for this participant
      // TODO set identity to username/userid
      { identity: uuidv4() }
    );
    // create a video grant for this specific room
    const videoGrant = new VideoGrant({
      room: roomName,
    });
  
    // add the video grant
    token.addGrant(videoGrant);
    // serialize the token and return it
    return token.toJwt();
  };