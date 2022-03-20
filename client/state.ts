import { rtdb } from "./rtdb";
import { ref, onValue, get, child, getDatabase } from "firebase/database";
import { response } from "express";
import { on } from "process";
import { json } from "body-parser";
import { platform } from "os";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4006";

type Jugada = "rock" | "paper" | "scissors";
type Game = { play1: Jugada; play2: Jugada };
type Result = "win" | "lose";

export const state = {
  data: {
    rtdbData: {},
    roomLongId: "",
    roomShortId: "",
    playerOneName: "",
    playerTwoName: "",
    playerTwoOnline: false,
    playerOneStart: false,
    playerTwoStart: false,
    currentGame: {
      play1: "",
      play2: "",
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
      const currentState = this.getState();
      const value = snapshot.val();
      currentState.rtdbData = value;
      console.log("*DataBASE change");
      this.setState(currentState);
    });
  },
  async setName(name) {
    const currentState = this.getState();
    currentState.playerOneName = name;
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
    const userName = currentState.playerOneName;

    const resSetRoom = await fetch("http://localhost:4006/rooms", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, userName }),
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
    currentState.playerTwoOnline = true;
    currentState.playerTwoName = name;
    const longIdRes = await fetch(`http://localhost:4006/sala`, {
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
        return res;
      }
    });
    const resLongIdData = await longIdRes.json();
    currentState.roomLongId = resLongIdData.roomLongId;
    state.setState(currentState);
    return resLongIdData;
  },

  async setStart() {
    const currentState = state.getState();
    const { playerOneName, roomLongId, playerTwoName } = currentState;

    var player = "";
    if (playerOneName) {
      player = "player1";
      console.log(player, "has clicked start");
    } else if (playerTwoName) {
      player = "player2";
      console.log(player, "has clicked start");
    }

    const resSetName = await fetch(
      `http://localhost:4006/start/${roomLongId}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player }),
      }
    );
    const resSetNameData = await resSetName.json();
    // state.setState(currentState);
    return resSetNameData;
  },

  async setPlayerChoice(move: Jugada) {
    const currentState = state.getState();
    const { playerOneName, playerTwoName, roomLongId } = currentState;

    var player = "";
    if (playerOneName) {
      player = "player1";
      console.log(player, "has clicked start");
    } else {
      player = "player2";
      console.log(player, "has clicked start");
    }

    const nameIdRes = await fetch(`http://localhost:4006/play/${player}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomLongId, move }),
    }).then((res) => {
      if (res.status >= 400 && res.status < 600) {
        alert("error setting move");
      } else {
        return res;
      }
    });

    const nameIdResData = await nameIdRes;
    // state.setState(currentState);
    return nameIdResData;
  },

  whoWins(play1, play2) {
    if (play1 == play2) {
      return 2;
    }
    const ganeConPiedra = play1 == "rock" && play2 == "scissors";
    const ganeConPapel = play1 == "paper" && play2 == "rock";
    const ganeConTijeras = play1 == "scissors" && play2 == "paper";

    const gane = [ganeConPapel, ganeConPiedra, ganeConTijeras].includes(true);

    const perdiConPiedra = play1 == "rock" && play2 == "paper";
    const perdiConPapel = play1 == "paper" && play2 == "scissors";
    const perdiConTijeras = play1 == "scissors" && play2 == "rock";

    const perdi = [perdiConPapel, perdiConPiedra, perdiConTijeras].includes(
      true
    );

    if (gane) {
      state.pushToHistory({ play1, play2 }, "win");
      return 0;
    }

    if (perdi) {
      state.pushToHistory({ play1, play2 }, "lose");
      return 1;
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
  subscribe(callback: (any: any) => any) {
    state.listeners.push(callback);
  },
};
