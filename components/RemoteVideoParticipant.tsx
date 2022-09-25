import React, { useEffect, useRef, useState } from 'react'
import { AudioTrack, RemoteAudioTrack, RemoteParticipant, RemoteTrackPublication, RemoteVideoTrack, Track, VideoTrack } from 'twilio-video';

interface Props {
    remoteParticipant: RemoteParticipant;
}
function RemoteVideoParticipant({ remoteParticipant }: Props) {
    const [videoTracks, setVideoTracks] = useState<VideoTrack[] | RemoteVideoTrack[]>([]);
    const [audioTracks, setAudioTracks] = useState<AudioTrack[] | RemoteAudioTrack[]>([]);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    function trackpubsToVideoTracks(trackMap: Map<Track.SID, RemoteTrackPublication>) {
        return Array.from(trackMap.values())
        .filter((publication) => publication.track !== null && publication.kind === 'video')
        .map((publication) => (publication.track as RemoteVideoTrack))
    }

    function trackpubsToAudioTracks(trackMap: Map<Track.SID, RemoteTrackPublication>) {
        return Array.from(trackMap.values())
            .filter((publication) => publication.track && publication.kind === 'audio')
            .map((publication) => (publication.track as RemoteAudioTrack));
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
        setVideoTracks(trackpubsToVideoTracks(remoteParticipant.videoTracks));
        setAudioTracks(trackpubsToAudioTracks(remoteParticipant.audioTracks));

        remoteParticipant.on('trackSubscribed', trackSubscribed);
        remoteParticipant.on('trackUnsubscribed', trackUnsubscribed);

        return () => {
            setVideoTracks([]);
            setAudioTracks([]);
            remoteParticipant.removeAllListeners();
        };
    }, [remoteParticipant]);

    useEffect(() => {
        const videoTrack = videoTracks[0];
        if (videoTrack && videoRef.current) {
            videoTrack.attach(videoRef.current);
            return () => {
                videoTrack.detach();
            };
        }
    }, [videoTracks]);

    useEffect(() => {
        const audioTrack = audioTracks[0];
        if (audioTrack && audioRef.current) {
            audioTrack.attach(audioRef.current);
            return () => {
                audioTrack.detach();
            };
        }
    }, [audioTracks]);
  return (
    <div className="participant">
            <h3>Remote - {remoteParticipant.identity}</h3>
            <video ref={videoRef} autoPlay={true} />
            <audio ref={audioRef} autoPlay={true} muted={true} />
        </div>
  )
}

export default RemoteVideoParticipant