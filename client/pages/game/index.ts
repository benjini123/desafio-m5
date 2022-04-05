import { Router } from "@vaadin/router";
import { stat } from "fs";
import { state } from "../../state";

type Jugada = "rock" | "paper" | "scissors";
type Match = {
  play1: Jugada;
  play2: Jugada;
};

customElements.define(
  "game-page",
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.render();
      state.subscribe(() => {
        const { currentGame } = state.getState().rtdbData as any;
        if (currentGame.player1.choice && currentGame.player2.choice) {
          Router.go("/reveal");
        }
      });
    }
    addListeners() {
      const awaitingEl = this.querySelector<HTMLElement>(".awaiting-opponent");
      const timerEl = this.querySelector<HTMLElement>(".timer");
      const elementCollection =
        this.querySelectorAll<HTMLElement>(".hoverable-choice");
      elementCollection.forEach((el) => {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          const move: Jugada = el.getAttribute("jugada") as Jugada;
          state.setPlayerChoice(move);
          awaitingEl.style.display = "initial";
          timerEl.style.display = "none";
          elementCollection.forEach((el) => {
            el.style.display = "none";
          });
        }),
          { once: true };
      });
    }
    render() {
      this.innerHTML = `
      <timer-comp class="timer"></timer-comp>
      <div class="awaiting-opponent">Waiting for opponent to choose...</div>
      <div class="hands">
        <div>
          <play-comp id="1" class="hoverable-choice" jugada="rock" hover></play-comp>
        </div>
        <div>
          <play-comp id="2" class="hoverable-choice" jugada="paper" hover></play-comp>
        </div>
        <div>
          <play-comp id="3" class="hoverable-choice" jugada="scissors" hover></play-comp>
        </div>
      </div>
      `;

      this.className = "div-root";
      this.addListeners();
    }
  }
);
