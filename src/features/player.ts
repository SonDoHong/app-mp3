import { createSlice } from "@reduxjs/toolkit";
import data from "../data";

interface Isong {
    id: number;
    title: string;
    singer: string;
    src: string;
    img_cover: string;
}

interface IPlayerState {
    songs: Isong[];
    currentSong: Isong | null;
    isPlaying: boolean;
    volume: number;
    loop: "on" | "one" | "off";
    suffle: boolean;
}

const initialState: IPlayerState = {
    songs: data,
    currentSong: null,
    isPlaying: false,
    volume: 1,
    loop: "off",
    suffle: false,
};

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        togglePlay(state) {
            if (!state.currentSong) {
                state.currentSong = state.songs[0];
            }

            state.isPlaying = !state.isPlaying;
        },
        setSong(state, action) {
            state.currentSong = state.songs[action.payload - 1];
        },
        prev(state) {
            if (!state.currentSong) {
                state.currentSong = state.songs[state.songs.length - 1];
            } else {
                const currentSong = state.currentSong;

                const currentSongIndex = state.songs.findIndex((song) => song.id === currentSong.id);

                state.currentSong = state.songs[currentSongIndex - 1] || state.songs[state.songs.length - 1];
            }

            if (!state.isPlaying) {
                state.isPlaying = true;
            }
        },
        next(state) {
            if (!state.currentSong) {
                state.currentSong = state.songs[0];
            } else {
                const currentSong = state.currentSong;

                const currentSongIndex = state.songs.findIndex((song) => song.id === currentSong.id);

                if (!state.suffle) {
                    if (state.loop === "off") {
                            state.currentSong = state.songs[currentSongIndex + 1] || currentSong;
                    } else {
                        state.currentSong = state.songs[currentSongIndex + 1] || state.songs[0];
                    }
                } else {
                    if (state.loop === "off") {
                        state.currentSong = state.songs[currentSongIndex + Math.floor(Math.random() * state.songs.length)] || currentSong;
                    } else {
                        state.currentSong = state.songs[currentSongIndex + Math.floor(Math.random() * state.songs.length)] || state.songs[0];
                    }
                }
            }

            if (!state.isPlaying) {
                state.isPlaying = true;
            }
        },
        setVolume(state, action) {
            state.volume = Number(action.payload);
        },
        toggleLoop(state) {
            if (state.loop === "off") {
                state.loop = "on";
            } else if (state.loop === "on") {
                state.loop = "one";
            } else if (state.loop === "one") {
                state.loop = "off";
            }
        },
        toggleSuffle(state) {
            state.suffle = !state.suffle;
        },
    },
});

export default playerSlice;
