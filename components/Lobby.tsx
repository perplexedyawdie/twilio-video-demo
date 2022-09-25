import React from 'react'
interface Props {
  username: string;
  handleUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  roomName: string;
  handleRoomNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.SyntheticEvent) => void;
}

function Lobby({
  username,
  handleUsernameChange,
  roomName,
  handleRoomNameChange,
  handleSubmit
}: Props) {
  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter a room</h2>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="field"
          value={username}
          onChange={handleUsernameChange}
          required
        />
      </div>

      <div>
        <label htmlFor="room">Room name:</label>
        <input
          type="text"
          id="room"
          value={roomName}
          onChange={handleRoomNameChange}
          required
        />
      </div>
      <button className='bg-red-300 hover:bg-black hover:text-white' type="submit">Submit</button>
    </form>
  )
}

export default Lobby