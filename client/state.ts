import { rtdb } from "./rtdb";
import { ref, onValue } from "firebase/database";

const API_BASE_URL = "https://rock-paper-scissors-bengie.herokuapp.com";

export type Jugada = "rock" | "paper" | "scissors";
export type Game = { play1: Jugada; play2: Jugada };
export type Player = "player1" | "player2";

export const state = {
  data: {
    rtdbData: {},
    roomLongId: "",
    roomShortId: "",
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
      this.setState(currentState);
    });
  },

  async handleClose() {
    const { player, roomLongId } = state.getState();
    const resResetPlayer = await fetch(
      `${API_BASE_URL}/offline/${roomLongId}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player }),
      }
    );
    const resResetPlayerData = await resResetPlayer;
    return resResetPlayerData;
  },

  async setPlayerOneName(name) {
    const currentState = this.getState();
    currentState.player = "player1";
    this.setState(currentState);

    const resSetName = await fetch(`${API_BASE_URL}/auth`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    const resSetNameData = await resSetName.json();

    return resSetNameData;
  },

  async setRoomLongId(userId, userName) {
    const currentState = state.getState();
    const resSetRoom = await fetch(`${API_BASE_URL}/rooms`, {
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
      `${API_BASE_URL}/rooms/${roomLongId.roomId}`,
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
    return resShortIdData;
  },

  async verifyRoom(shortId) {
    const currentState = state.getState();
    currentState.roomShortId = shortId;

    const longIdRes = await fetch(`${API_BASE_URL}/sala`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shortId }),
    }).then((res) => {
      if (res.status >= 400 && res.status < 600) {
        alert("Ups, no existe un room con ese id");
      } else {
        return res;
      }
    });
    const resLongIdData = await longIdRes.json();
    currentState.roomLongId = resLongIdData.roomLongId;
    state.setState(currentState);
    return resLongIdData;
  },

  async verifyPlayer(name, owner) {
    const currentState = state.getState();
    const { roomLongId } = currentState;

    var player = "player2";

    if (name == owner) {
      player = "player1";
    }

    const onlineRes = await fetch(`${API_BASE_URL}/verify/${roomLongId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player, name }),
    }).then((res) => {
      if (res.status >= 400 && res.status < 600) {
        throw Error(res.statusText);
      } else {
        currentState.player = player;
        state.setState(currentState);
        return res;
      }
    });
    const onlineResData = await onlineRes;
    return onlineResData;
  },

  async setPlayerOnline() {
    const currentState = state.getState();
    const { roomLongId, player } = currentState;

    const onlineRes = await fetch(`${API_BASE_URL}/online/${roomLongId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player }),
    }).then((res) => {
      if (res.status >= 400 && res.status < 600) {
        throw Error(res.statusText);
      } else {
        return res;
      }
    });
    const onlineResData = await onlineRes;
    return onlineResData;
  },

  async setStart() {
    const currentState = state.getState();
    const { player, roomLongId } = currentState;
    console.log(player, "has now clicked start");

    const resSetName = await fetch(`${API_BASE_URL}/start/${roomLongId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player }),
    });

    const resSetNameData = await resSetName.json();
    return resSetNameData;
  },

  async setPlayerChoice(choice: Jugada) {
    const { roomLongId, player } = state.getState();
    console.log(player + " has chosen " + choice);

    const nameIdRes = await fetch(`${API_BASE_URL}/choice/${player}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomLongId, choice }),
    }).then((res) => {
      if (res.status >= 400 && res.status < 600) {
        alert("error setting move");
      } else {
        return res;
      }
    });

    const nameIdResData = await nameIdRes.json();
    return nameIdResData;
  },

  whoWins(play1, play2) {
    const cs = state.getState();
    const { playerOneName } = cs;

    const ganeConPiedra = play1 == "rock" && play2 == "scissors";
    const ganeConPapel = play1 == "paper" && play2 == "rock";
    const ganeConTijeras = play1 == "scissors" && play2 == "paper";
    const player1Wins = [ganeConPapel, ganeConPiedra, ganeConTijeras].includes(
      true
    );

    const perdiConPiedra = play1 == "rock" && play2 == "paper";
    const perdiConPapel = play1 == "paper" && play2 == "scissors";
    const perdiConTijeras = play1 == "scissors" && play2 == "rock";
    const player2Wins = [
      perdiConPapel,
      perdiConPiedra,
      perdiConTijeras,
    ].includes(true);

    var winner: Player = "player2";

    if (play1 == play2) {
      return;
    } else if (player1Wins) {
      winner = "player1";
      return winner;
    } else {
      return winner;
    }
  },

  async pushToHistory(game: Game, winner: Player) {
    const { roomLongId } = state.getState();
    const pushGame = await fetch(`${API_BASE_URL}/history/${roomLongId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ winner, game }),
    }).then((res) => {
      if (res.status >= 400 && res.status < 600) {
        alert("error pushing to history");
      } else {
        return res;
      }
    });
    const pushGameData = await pushGame.json();
    return pushGameData;
  },
  getScores() {
    const cs = state.getState().rtdbData;
    const games = cs.previousGames;

    var player1Score = 0;
    var player2Score = 0;

    if (games !== undefined) {
      const keys = Object.values(games);
      keys.forEach((key: any) => {
        console.log(key.winner);
        if (key.winner === "player1") {
          player1Score++;
        } else {
          player2Score++;
        }
      });
    }

    return { player1Score, player2Score };
  },

  async resetPlayer() {
    const { roomLongId, player } = state.getState();

    const resetGame = await fetch(`${API_BASE_URL}/reset/${roomLongId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player }),
    });

    const resetGameData = await resetGame.json();
    return resetGameData;
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
