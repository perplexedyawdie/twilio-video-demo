import React, { useState, useCallback } from 'react'
import Lobby from './Lobby';
import VideoRoom from './VideoRoom';

function VideoChat() {
    const [username, setUsername] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');
    const [token, setToken] = useState<string | null>(null);

    const handleUsernameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }, []);

    const handleRoomNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(event.target.value);
    }, []);

    const handleSubmit = useCallback(async (event: React.SyntheticEvent) => {
        event.preventDefault();
        const data = await fetch('/api/join-room', {
            method: 'POST',
            body: JSON.stringify({
                identity: username,
                roomName
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        setToken(data.token);
    }, [username, roomName]);

    const handleLogout = useCallback((event: React.SyntheticEvent) => {
        setToken(null);
    }, []);

    return (
        <>
            {
                token ? (
                    <VideoRoom roomName={roomName} token={token} handleLogout={handleLogout} />
                ) : (
                    <Lobby
                        username={username}
                        roomName={roomName}
                        handleUsernameChange={handleUsernameChange}
                        handleRoomNameChange={handleRoomNameChange}
                        handleSubmit={handleSubmit}
                    />
                )
            }
        </>
    )
}

export default VideoChat