import React, { useEffect, useRef, useState } from 'react'
import { VideoTrack, AudioTrack, Track, LocalTrackPublication, RemoteTrackPublication, RemoteVideoTrack, LocalVideoTrack, LocalAudioTrack, RemoteAudioTrack } from 'twilio-video';
interface Props {
    participant: any;
}

function VideoParticipant({ participant }: Props) {
    const [videoTracks, setVideoTracks] = useState<VideoTrack[] | RemoteVideoTrack[] | LocalVideoTrack[]>([]);
    const [audioTracks, setAudioTracks] = useState<AudioTrack[] | RemoteAudioTrack[] | LocalAudioTrack[]>([]);

    const videoRef = useRef<any>();
    const audioRef = useRef<any>();
    function trackpubsToVideoTracks(trackMap: Map<Track.SID, LocalTrackPublication | RemoteTrackPublication>) {
        return Array.from(trackMap.values())
        .filter((publication) => publication.track !== null && publication.kind === 'video')
        .map((publication) => (publication.track as RemoteVideoTrack | LocalVideoTrack))
    }

    function trackpubsToAudioTracks(trackMap: Map<Track.SID, LocalTrackPublication | RemoteTrackPublication>) {
        return Array.from(trackMap.values())
            .filter((publication) => publication.track && publication.kind === 'audio')
            .map((publication) => (publication.track as RemoteAudioTrack | LocalAudioTrack));
    }

    useEffect(() => {
        const trackSubscribed = (track: Track) => {
            if (track.kind === 'video') {
                setVideoTracks(function (videoTracks: VideoTrack[]): VideoTrack[] {
                    return [...videoTracks, (track as VideoTrack)]
                });
            } else {
                setAudioTracks(function (audioTracks: AudioTrack[]): AudioTrack[] {
                    return [...audioTracks, (track as AudioTrack)]
                })
            }
        };

        const trackUnsubscribed = (track: Track) => {
            if (track.kind === 'video') {
                setVideoTracks((videoTracks: VideoTrack[]) => videoTracks.filter((v: VideoTrack) => v !== track));
            } else {
                setAudioTracks((audioTracks: AudioTrack[]) => audioTracks.filter((a: AudioTrack) => a !== track));
            }
        };
        setVideoTracks(trackpubsToVideoTracks(participant.videoTracks));
        setAudioTracks(trackpubsToAudioTracks(participant.audioTracks));

        participant.on('trackSubscribed', trackSubscribed);
        participant.on('trackUnsubscribed', trackUnsubscribed);

        return () => {
            setVideoTracks([]);
            setAudioTracks([]);
            participant.removeAllListeners();
        };
    }, [participant]);

    useEffect(() => {
        const videoTrack = videoTracks[0];
        if (videoTrack) {
            videoTrack.attach(videoRef.current);
            return () => {
                videoTrack.detach();
            };
        }
    }, [videoTracks]);

    useEffect(() => {
        const audioTrack = audioTracks[0];
        if (audioTrack) {
            audioTrack.attach(audioRef.current);
            return () => {
                audioTrack.detach();
            };
        }
    }, [audioTracks]);

    return (
        <div className="participant">
            <h3>{participant.identity}</h3>
            <video ref={videoRef} autoPlay={true} />
            <audio ref={audioRef} autoPlay={true} muted={true} />
        </div>
    )
}

export default VideoParticipant