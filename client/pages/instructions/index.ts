import { Router } from "@vaadin/router";
import { listeners } from "process";
import { state } from "../../state";

customElements.define(
  "instructions-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      state.subscribe(() => {
        const { currentGame } = state.getState().rtdbData as any;
        const player1Start = currentGame.player1.start;
        const player2Start = currentGame.player2.start;
        if (player1Start && player2Start) {
          Router.go("/game");
        }
      });

      this.render();
    }
    addListeners() {
      const hiddenEl = this.querySelector<HTMLElement>(".awaiting-opponent");
      const buttonEl = this.querySelector<HTMLElement>(".button-element");
      buttonEl.addEventListener("click", (e) => {
        e.preventDefault();
        buttonEl.style.display = "none";
        hiddenEl.style.display = "initial";
        state.setStart();
      });
    }
    render() {
      this.innerHTML = `
      <h2 class="rampart-font welcome__main-title ">Press play and choose between the three options before the timer runs out..</h2>
      <button class="button-element">start</button>
      <div class="awaiting-opponent">waiting for opponent to click start...</div>
      <div class="hands">
        <play-comp jugada="rock"></play-comp>
        <play-comp jugada="paper"></play-comp>
        <play-comp jugada="scissors"></play-comp>
      </div>
      `;
      this.className = "div-root";
      this.addListeners();
    }
  }
);
