import { Router } from "@vaadin/router";
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
        const { currentGame } = state.getState().rtdbData;
        const playerOneOnline = currentGame.player1.online;
        const playerTwoOnline = currentGame.player2.online;
        if (playerOneOnline && playerTwoOnline) {
          Router.go("/instructions");
        }
      });
      state.setPlayerOnline();
    }
    render() {
      state.subscribe(() => {
        setTimeout(() => {
          state.handleClose();
        }, 100000);
      });
      const { player, rtdbData, roomShortId } = state.getState();

      const player1Name = rtdbData.currentGame.player1.name;
      const player2Name = rtdbData.currentGame.player2.name;
      const playerOneTrue = player == "player1";

      const score = state.getScores();
      this.innerHTML = `
        
      <header class="espera__header odibee-font">
        <div class="espera__jugadores">
          <p>${playerOneTrue ? player1Name : player2Name}: ${
        playerOneTrue ? score.player1Score : score.player2Score
      }</p>  
          <p>${playerOneTrue ? player2Name : player1Name}: ${
        playerOneTrue ? score.player2Score : score.player1Score
      }</p>
        </div>
        <div class="espera__jugadores">
          <p class="espera__header-sala-txt">SALA</p>
          <p>${roomShortId}</p>
        </div>
      </header>
      <div class="espera__text-box">
        <h2 class="espera__main-title rampart-font">Compartí el código:</h2>
        <h2>${roomShortId}</h2>
        <h2 class="espera__main-title rampart-font">Con tu contrincante</h2>
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
