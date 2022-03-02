import { Router } from "@vaadin/router";
import { rtdb } from "../../rtdb";
import { state } from "../../state";

customElements.define(
  "espera-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      state.subscribe(() => {
        const playerTwoOnline =
          state.getState().rtdbData.currentGame.player2.online;
        console.log("player two is: " + playerTwoOnline);
        if (playerTwoOnline === true) {
          Router.go("/instructions");
        } else {
          // this.render();
        }
      });
    }
    render() {
      const currentState = state.getState();
      const data = currentState.rtdbData;
      const player1Name = data.currentGame.player1.name;
      const player2Name = data.currentGame.player2.name;
      const won = currentState.history.previousGames.won.length;
      const lost = currentState.history.previousGames.lost.length;
      const roomShortId = currentState.roomShortId;

      this.innerHTML = `
        
      <header class="espera__header">
        <div class="espera__jugadores">
          <p>${player1Name}: ${won}</p>  
          <p>${player2Name}: ${lost}</p>
        </div>
        <div>
          <p style="fontWeight:bold">SALA</p>
          <p>${roomShortId}</p>
        </div>
      </header>
      <div class="espera__text-box">
        <h2 class="welcome__main-title rampart-font">Compartí el código:</h2>
        <h2>${roomShortId}</h2>
        <h2 class="welcome__main-title rampart-font">Con tu contrincante</h2>
      </div>
      <div class="hands">
        <play-comp jugada="rock"></play-comp>
        <play-comp jugada="paper"></play-comp>
        <play-comp jugada="scissors"></play-comp>
      </div>
      `;
      this.className = "div-root";
    }
  }
);
