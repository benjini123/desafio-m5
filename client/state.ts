type Jugada = "rock" | "paper" | "scissors";
type Game = { myPlay: Jugada; computerPlay: Jugada };
type Result = "win" | "lose";

export const state = {
  data: {
    rtdbData: {},
    roomId: "",
    name: "",
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
    // Connection with RTDB
    // const rtdbRef = rtdb.ref(`rooms/${this.data.roomId}`);
    // rtdbRef.on("value", (snapshot) => {
    //   const currentState = this.getState();
    //   const value = snapshot.val();
    //   currentState.rtdbData = value.currentGame;
    //   this.saveData(currentState);
    // });
  },
  setName(name) {
    const currentState = state.getState();
    currentState.name = name;
    fetch("http://localhost:4006/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify(name),
    })
      .then((res) => res.json())
      .then((response) => {
        response.json();
        state.setState(currentState);
      });
  },
  getState() {
    const games = state.data;
    return games;
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
