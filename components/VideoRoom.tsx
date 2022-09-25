import React, { useState, useEffect } from 'react'
import Video, { Room, Participant, LocalTrackPublication } from 'twilio-video';
import VideoParticipant from './VideoParticipant';


interface Props {
    roomName: string;
    token: string;
    handleLogout: (event: React.SyntheticEvent) => void;
}

function VideoRoom({
    roomName,
    token,
    handleLogout
}: Props) {
    const [room, setRoom] = useState<Room | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);

    const remoteParticipants = participants.map((participant: Participant) => (
        <p key={participant?.sid}>{participant?.identity}</p>
    ));

    useEffect(() => {
        const participantConnected = (participant: Participant) => {
            setParticipants(function (prevParticipants: Participant[]) {
                return [...prevParticipants, participant]
            });
        };
        const participantDisconnected = (participant: Participant) => {
            setParticipants(function (prevParticipants: Participant[]) {
                return prevParticipants.filter((p: Participant) => p !== participant)
            }
            );
        };
        Video.connect(token, {
            name: roomName
        })
            .then((room: Room) => {
                setRoom(room);
                room.on('participantConnected', participantConnected);
                room.on('participantDisconnected', participantDisconnected);
                room.participants.forEach(participantConnected);
            })
            .catch(console.error);

        return () => {
            setRoom((currentRoom: Room | null) => {
                // ! I wonder why currentRoom.localParticipant.state is a string and not an ENUM
                if (currentRoom && currentRoom.localParticipant.state === 'connected') {
                    // ! In the blog, they didn't convert the tracks[] from a Map to regular array
                    Array.from(currentRoom.localParticipant.tracks.values())
                        .forEach(function (trackPublication: LocalTrackPublication) {
                            switch (trackPublication.track.kind) {
                                case 'audio':
                                    trackPublication.track.stop();
                                    break;
                                case 'video':
                                    trackPublication.track.stop();
                                    break;
                                default:
                                    throw new Error(`Can't stop the track! 🚂 \n Track Type: ${trackPublication.track.kind}`);
                            }
                        });
                    currentRoom.disconnect();
                    return null;
                } else {
                    return currentRoom;
                }
            });
        };
    }, [roomName, token]);
    return (
        <div className="room">
            <h2>Room: {roomName}</h2>
            <button onClick={handleLogout}>Log out</button>
            <div className="local-participant">
                {room ? (
                    <VideoParticipant
                        key={room.localParticipant.sid}
                        participant={room.localParticipant}
                    />
                ) : (
                    ''
                )}
            </div>
            <h3>Remote Participants</h3>
            <div className="remote-participants">{remoteParticipants}</div>
        </div>
    )
}

export default VideoRoom