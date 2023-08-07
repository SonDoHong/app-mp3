import { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faPlay,
    faPause,
    faForwardStep,
    faBackwardStep,
    faRepeat,
    faShuffle,
    faVolumeHigh,
    faVolumeXmark,
    faEllipsis 
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

import { useAppDispatch, useAppSelector } from "./features/hooks";
import playerSlice from "./features/player";

import "./App.css";

function App() {
    const dispatch = useAppDispatch();

    const { songs, currentSong, isPlaying, volume, loop, suffle } = useAppSelector((state) => state.player);

    const [mute, setMute] = useState(false);

    const playerRef = useRef<HTMLAudioElement>(new Audio());

    const currentTimeRef = useRef<HTMLSpanElement | null>(null);

    const durationnRef = useRef<HTMLSpanElement | null>(null);

    const timeRef = useRef<HTMLInputElement | null>(null);

    // currentSong
    useEffect(() => {
        if (currentSong) {
            playerRef.current.src = currentSong.src;
            playerRef.current.load();
        }
    }, [currentSong]);

    // Playing
    useEffect(() => {
        if (!currentSong) return;

        if (isPlaying) {
            playerRef.current.play();
        } else {
            playerRef.current.pause();
        }
    }, [isPlaying, currentSong]);

    // Volume
    useEffect(() => {
        if (volume > 0 && mute === false) {
            playerRef.current.volume = volume / 100;

            playerRef.current.muted = false;
        } else {
            playerRef.current.volume = 0;

            playerRef.current.muted = true;
        }
    }, [volume, mute]);

    // Time
    useEffect(() => {
        // format tổng giây => giờ : phút
        const formatTime = (timeInSeconds: number) => {
            const hours = Math.floor(timeInSeconds / 60);
            const minutes = Math.floor(timeInSeconds % 60);

            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        };

        // Tổng thời gian
        const updateDuration = () => {
            if (durationnRef.current) {
                durationnRef.current.textContent = formatTime(playerRef.current.duration);
            }

            if (timeRef.current) {
                timeRef.current.max = playerRef.current.duration.toString();
            }
        };

        // update thời gian từng giây
        const updateTime = () => {
            if (currentTimeRef.current) {
                currentTimeRef.current.textContent = formatTime(playerRef.current.currentTime);
            }

            if (timeRef.current) {
                timeRef.current.value = playerRef.current.currentTime.toString();
            }
        };

        playerRef.current.addEventListener("durationchange", updateDuration);

        playerRef.current.addEventListener("timeupdate", () => {
            updateTime();
        });

        return () => {
            // Clean up the event listeners when the component unmounts
            // Gọi phát return remove luôn
            // không thì sẽ bị gọi 2 lần
            playerRef.current.removeEventListener("durationchange", updateDuration);
            playerRef.current.removeEventListener("timeupdate", updateTime);
        };
    }, []);

    // Handle hết nhạc (có || không điều kiện)
    useEffect(() => {
        const onEnded = () => {
            if (loop === "one") {
                playerRef.current.currentTime = 0;
                playerRef.current.play();
            } else {
                dispatch(playerSlice.actions.next());
            }
        };

        playerRef.current.addEventListener("ended", onEnded);

        return () => {
            // Clean up the event listeners when the component unmounts
            // Gọi phát return remove luôn
            // không thì sẽ bị gọi 2 lần
            playerRef.current.removeEventListener("ended", onEnded);
        };
    }, [loop]);

    return (
        <div className="app">
            <div className="header">
                <h2>NHẠC HOT 2023</h2>
            </div>
            <div className="container">
                <div className="singer">
                    <div className="singer_img">
                        <img src="https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/e/e/b/3/eeb389e4d08e20541846daae3ab30087.jpg" alt="" />
                    </div>
                    <p>Top 100 Bài Hát Nhạc Trẻ Hay Nhất</p>
                </div>
                <div className="song_list">
                    <div className="song_heading">
                        <div className="song_heading-title">BÀI HÁT</div>
                        <div className="song_heading-singer">CA SĨ</div>
                        <div className="song_heading-other">KHÁC</div>
                    </div>
                    {songs.map((song) => (
                        <div key={song.id} className={`song_item ${currentSong?.id === song.id && "active"}`} onClick={() => dispatch(playerSlice.actions.setSong(song.id))}>
                            <span className="song_item-title">
                                <img src={song.img_cover} alt="" />
                                {song.title}
                            </span>
                            <span className="song_item-singer">{song.singer}</span>
                            <span className="song_item-other">
                                <span className="heart-icon">
                                    <FontAwesomeIcon icon={faHeartRegular} />
                                </span>

                                <span>
                                    <FontAwesomeIcon icon={faEllipsis} />
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="player-controls">
                <div className="player-controls_left player-controls_item">
                    <div className="player-controls_left-img">{currentSong ? <img src={currentSong?.img_cover} className={isPlaying ? "active" : ""} alt="" /> : "Chưa chọn bài hát"}</div>

                    <div className="player-controls_left-name">
                        <div className="player-controls_left-name-title">{currentSong?.title}</div>

                        <div className="player-controls_left-name-singer">{currentSong?.singer}</div>
                    </div>
                </div>

                <div className="player-controls_center player-controls_item">
                    <div className="btns">
                        <button onClick={() => dispatch(playerSlice.actions.toggleSuffle())}>
                            <FontAwesomeIcon icon={faShuffle} className={suffle ? "shuffle-active" : ""} />
                        </button>

                        <button onClick={() => dispatch(playerSlice.actions.prev())}>
                            <FontAwesomeIcon icon={faBackwardStep} />
                        </button>

                        <button className="btn-player" onClick={() => dispatch(playerSlice.actions.togglePlay())}>
                            {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                        </button>

                        <button onClick={() => dispatch(playerSlice.actions.next())}>
                            <FontAwesomeIcon icon={faForwardStep} />
                        </button>

                        <button onClick={() => dispatch(playerSlice.actions.toggleLoop())}>
                            {loop === "off" && <FontAwesomeIcon icon={faRepeat} />}
                            {loop === "on" && <FontAwesomeIcon icon={faRepeat} className="repeat-icon" />}
                            {loop === "one" && (
                                <div className="repeat-icon-one">
                                    <FontAwesomeIcon icon={faRepeat} className="repeat-icon" />
                                </div>
                            )}
                        </button>
                    </div>

                    <div className="time">
                        <span ref={currentTimeRef}>00:00</span>
                        <input
                            ref={timeRef}
                            type="range"
                            className="input_range"
                            defaultValue={0}
                            onChange={(e) => {
                                currentSong && (playerRef.current.currentTime = Number(e.target.value));
                                isPlaying ? playerRef.current.play() : playerRef.current.pause();
                            }}
                        />
                        <span ref={durationnRef}>00:00</span>
                    </div>
                </div>

                <div className="player-controls_right player-controls_item">
                    <div className="mute">
                        <div className="btns">
                            <button
                                onClick={() => {
                                    if (volume === 0) {
                                        setMute(!mute);
                                    } else {
                                        setMute(!mute);
                                    }
                                }}
                            >
                                {mute ? <FontAwesomeIcon icon={faVolumeXmark} /> : <FontAwesomeIcon icon={faVolumeHigh} />}
                            </button>
                        </div>

                        <input
                            type="range"
                            className="input_range"
                            value={mute ? 0 : volume}
                            min={0}
                            max={20}
                            onChange={(e) => {
                                dispatch(playerSlice.actions.setVolume(e.target.value));
                                let inputRangeValue = Number(e.target.value);
                                if (inputRangeValue === 0) {
                                    console.log(inputRangeValue);
                                    setMute(!mute);
                                } else {
                                    setMute(false);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
