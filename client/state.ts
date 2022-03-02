import { rtdb } from "./rtdb";
import { ref, onValue, get, child, getDatabase } from "firebase/database";
import { response } from "express";
import { on } from "process";
import { json } from "body-parser";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4006";

type Jugada = "rock" | "paper" | "scissors";
type Game = { myPlay: Jugada; computerPlay: Jugada };
type Result = "win" | "lose";

export const state = {
  data: {
    rtdbData: {},
    roomLongId: "",
    roomShortId: "",
    name: "",
    playerTwoName: "",
    playerTwoOnline: false,
    currentGame: {
      myPlay: "",
      computerPlay: "",
    },
    history: {
      previousGames: { won: [], lost: [] },
    },
  },
  listeners: [],

  init() {
    const localData = JSON.parse(localStorage.getItem("saved-plays"));
    if (!localData) {
      return;
    } else {
      state.setState(localData);
    }
  },
  listenDatabase() {
    const cs = this.getState();
    const longId = cs.roomLongId;

    const rtdbRef = ref(rtdb, `chatrooms/${longId}`);
    onValue(rtdbRef, (snapshot) => {
      console.log("1234");
      const currentState = this.getState();
      const value = snapshot.val();
      console.log(value);
      currentState.rtdbData = value;
      this.setState(currentState);
      console.log(state.data);
    });
  },
  async setName(name) {
    const currentState = this.getState();
    currentState.name = name;
    this.setState(currentState);

    const resSetName = await fetch("http://localhost:4006/auth", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    const resSetNameData = await resSetName.json();

    return resSetNameData;
  },

  async setRoomLongId(userId) {
    const currentState = state.getState();

    const resSetRoom = await fetch("http://localhost:4006/rooms", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, userName: this.getState().name }),
    });
    const resSetRoomData = await resSetRoom.json();
    currentState.roomLongId = resSetRoomData.roomId;
    state.setState(currentState);
    return resSetRoomData;
  },

  async setRoomShortId(roomLongId) {
    const currentState = state.getState();
    const resShortId = await fetch(
      `http://localhost:4006/rooms/${roomLongId.roomId}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resShortIdData = await resShortId.json();
    currentState.roomShortId = resShortIdData.shortId;
    state.setState(currentState);
    console.log(resShortIdData);
  },

  async goToRoom(name, shortId) {
    const currentState = state.getState();
    currentState.roomShortId = shortId;

    const nameIdRes = await fetch(`http://localhost:4006/sala`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, shortId }),
    }).then((res) => {
      if (res.status >= 400 && res.status < 600) {
        alert(
          "Ups, esta sala está completa y tu nombre no coincide con nadie en la sala."
        );
      } else {
        currentState.playerTwoOnline = true;
        currentState.playerTwoName = name;
        return res;
      }
    });
    const resShortIdData = await nameIdRes.json();
    currentState.roomLongId = resShortIdData.roomLongId;
    console.log(resShortIdData.roomLongId);
    console.log(currentState);
    state.setState(currentState);
    return resShortIdData;
  },

  getState() {
    const data = this.data;
    return data;
  },

  setState(newState: any) {
    this.data = newState;
    localStorage.setItem("saved-plays", JSON.stringify(newState));
    for (const cb of state.listeners) {
      cb();
    }
  },
  setMove(move: Jugada) {
    const currentState = state.getState().currentGame;
    currentState.myPlay = move;
    var randomNumber = Math.floor(Math.random() * 3 + 1);
    if (randomNumber == 1) {
      currentState.computerPlay = "rock";
    } else if (randomNumber == 2) {
      currentState.computerPlay = "paper";
    } else {
      currentState.computerPlay = "scissors";
    }
  },
  pushToHistory(play: Game, result: Result) {
    const currentState = state.getState();
    if (result == "win") {
      currentState.history.previousGames.won.push(play);
    } else {
      currentState.history.previousGames.lost.push(play);
    }

    state.setState(currentState);
  },
  whoWins(myPlay, computerPlay) {
    if (myPlay == computerPlay) {
      return 2;
    }
    const ganeConPiedra = myPlay == "rock" && computerPlay == "scissors";
    const ganeConPapel = myPlay == "paper" && computerPlay == "rock";
    const ganeConTijeras = myPlay == "scissors" && computerPlay == "paper";

    const gane = [ganeConPapel, ganeConPiedra, ganeConTijeras].includes(true);

    const perdiConPiedra = myPlay == "rock" && computerPlay == "paper";
    const perdiConPapel = myPlay == "paper" && computerPlay == "scissors";
    const perdiConTijeras = myPlay == "scissors" && computerPlay == "rock";

    const perdi = [perdiConPapel, perdiConPiedra, perdiConTijeras].includes(
      true
    );

    if (gane) {
      state.pushToHistory({ myPlay, computerPlay }, "win");
      return 0;
    }

    if (perdi) {
      state.pushToHistory({ myPlay, computerPlay }, "lose");
      return 1;
    }
  },
  subscribe(callback: (any: any) => any) {
    state.listeners.push(callback);
  },
};
