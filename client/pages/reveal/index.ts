import { Router } from "@vaadin/router";
import { state, Jugada, Game, Player } from "../../state";

customElements.define(
  "reveal-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      state.listeners = [];
      this.render();
      state.subscribe(() => {
        window.addEventListener("unload", function (e) {
          e.preventDefault();
          state.handleClose();
        });
      });
    }
    render() {
      const cs = state.getState();
      const { currentGame } = cs.rtdbData as any;

      var play1: Jugada = currentGame.player1.choice;
      var play2: Jugada = currentGame.player2.choice;
      const game: Game = { play1, play2 };
      const winner: Player = state.whoWins(play1, play2);

      const { player } = cs;
      const playerOneTrue = player == "player1";

      if (winner && playerOneTrue) {
        state.pushToHistory(game, winner);
      }

      this.innerHTML = `
      <play-comp class="top-choice" reveal="true" jugada=${
        playerOneTrue ? play2 : play1
      }></play-comp>
      <play-comp class="bottom-choice" reveal="true" jugada=${
        playerOneTrue ? play1 : play2
      } ></play-comp>
    `;

      this.className = "div-root";

      setTimeout(() => {
        state.resetPlayer().then(() => {
          if (!winner) {
            Router.go("/empate");
          } else if (player == winner) {
            Router.go("/ganaste");
          } else {
            Router.go("/perdiste");
          }
        });
      }, 3000);
    }
  }
);
