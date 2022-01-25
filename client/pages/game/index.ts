import { Router } from "@vaadin/router";
import { state } from "../../state";

type Match = {
  myPlay: string;
  computerPlay: string;
};

customElements.define(
  "game-page",
  class extends HTMLElement {
    game: Match;

    connectedCallback() {
      state.subscribe(() => {
        const currentState = state.getState();
        this.game = currentState.currentGame;
      });
      this.render();
    }
    addListeners() {
      const elementCollection = this.querySelectorAll(".hoverable-choice");
      elementCollection.forEach((ev) => {
        ev.addEventListener("click", (e) => {
          e.stopPropagation;
          const move = ev.getAttribute("jugada");
          if (move == "rock") {
            state.setMove("rock");
          } else if (move == "paper") {
            state.setMove("paper");
          } else {
            state.setMove("scissors");
          }

          Router.go("/reveal");
        });
      });
    }

    render() {
      this.innerHTML = `
      <timer-comp class="timer"></timer-comp>
      <div class="hands">
        <div>
          <play-comp id="1" class="hoverable-choice" jugada="rock" hover></play-comp>
        </div>
        <play-comp class="hoverable-choice" jugada="paper" hover></play-comp>
        <play-comp class="hoverable-choice" jugada="scissors" hover></play-comp>
      </div>
      `;

      this.className = "div-root";
      this.addListeners();
    }
  }
);
