import { Router } from "@vaadin/router";
import { rtdb } from "../../../server/rtdb";
import { state } from "../../state";

customElements.define(
  "espera-page",
  class extends HTMLElement {
    rtdbData: any;
    constructor() {
      super();
      this.rtdbData = state.getState().rtdbData;
    }
    connectedCallback() {
      console.log(this.rtdbData.currentGame.player2.name);
      console.log(this.rtdbData);
      this.render();
      state.subscribe(() => {
        const { playerTwoOnline } = state.getState();
        console.log(playerTwoOnline);
        if (playerTwoOnline == true && playerTwoOnline != undefined) {
          Router.go("/instructions");
        } else {
          this.render();
        }
      });
    }
    render() {
      this.innerHTML = `
        
      <header class="espera__header">
        <div class="espera__jugadores">
          <p>${state.getState().name}: ${
        state.getState().history.previousGames.won
      }</p>  
          <p>${this.rtdbData.currentGame.player2.name}: ${
        state.getState().history.previousGames.lost
      }</p>
        </div>
        <div>
          <p style="fontWeight:bold">SALA</p>
          <p>${state.getState().roomShortId}</p>
        </div>
      </header>
      <div class="espera__text-box">
        <h2 class="welcome__main-title rampart-font">Compartí el código:</h2>
        <h2>${state.getState().roomShortId}</h2>
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
