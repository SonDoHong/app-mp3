// import { useEffect, useRef, useState } from 'react';
// import { useAppDispatch, useAppSelector } from "./features/hooks";
// import playerSlice from "./features/player";

// function formatTime(seconds) {
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
// }

// function App() {
//   const dispatch = useAppDispatch();
//   const [currentTime, setCurrentTime] = useState(0);

//   const { songs, currentSong, isPlaying, volume } = useAppSelector((state) => state.player);

//   const playerRef = useRef<HTMLAudioElement>(new Audio());

//   useEffect(() => {
//     if (currentSong) {
//       playerRef.current.src = currentSong.src;
//       playerRef.current.load();
//     }
//   }, [currentSong]);

//   useEffect(() => {
//     if (!currentSong) return;

//     if (isPlaying) {
//       playerRef.current.play();
//     } else {
//       playerRef.current.pause();
//     }
//   }, [isPlaying, currentSong]);

//   useEffect(() => {
//     if (volume !== null) {
//       playerRef.current.volume = parseFloat(volume) / 100;
//       playerRef.current.muted = false;
//     } else {
//       playerRef.current.muted = true;
//     }
//   }, [volume]);

//   useEffect(() => {
//     const handleSongEnd = () => {
//       // Gọi hàm để chuyển bài khi nhạc kết thúc
//       dispatch(playerSlice.actions.next());
//     };

//     const handleTimeUpdate = () => {
//       setCurrentTime(playerRef.current.currentTime);
//     };

//     playerRef.current.addEventListener('ended', handleSongEnd);
//     playerRef.current.addEventListener('timeupdate', handleTimeUpdate);

//     return () => {
//       // Dọn dẹp khi component unmount
//       playerRef.current.removeEventListener('ended', handleSongEnd);
//       playerRef.current.removeEventListener('timeupdate', handleTimeUpdate);
//     };
//   }, [dispatch]);

//   return (
//     <div className="app">
//       {songs.map((song) => (
//         <div key={song.id} onClick={() => dispatch(playerSlice.actions.setSong(song.id))}>
//           {song.title} {currentSong?.id === song.id && '(playing)'}
//         </div>
//       ))}

//       <div>{formatTime(currentTime)} / {currentSong ? formatTime(currentSong.duration) : '00:00'}</div>

//       <button onClick={() => dispatch(playerSlice.actions.prev())}>Prev</button>
//       <button onClick={() => dispatch(playerSlice.actions.togglePlay())}>{isPlaying ? 'Pause' : 'Play'}</button>
//       <button onClick={() => dispatch(playerSlice.actions.next())}>Next</button>
//       <form>
//         <label htmlFor="mute">Mute</label>
//         {/* <input type="checkbox" id='mute' onChange={(e) => {const checkbox = e.target.checked; dispatch(playerSlice.actions.toggleSuffle(checkbox))}} /> */}
//         <input type="range" min={0} max={100} onChange={(e) => dispatch(playerSlice.actions.setVolume(e.target.value))} />
//       </form>
//     </div>
//   );
// }

// export default App;
