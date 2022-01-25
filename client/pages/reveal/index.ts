import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "reveal-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {
      const computerPlay =
        this.querySelector(".computer-choice").getAttribute("jugada");

      const myPlay = this.querySelector(".my-choice").getAttribute("jugada");

      setTimeout(() => {
        const results = state.whoWins(myPlay, computerPlay);
        if (results == 2) {
          Router.go("/game");
        } else if (results == 1) {
          Router.go("/perdiste");
        } else {
          Router.go("/ganaste");
        }
      }, 3000);
    }
    render() {
      this.innerHTML = `
      <play-comp class="computer-choice" reveal="true" jugada=${
        state.getState().currentGame.computerPlay
      }></play-comp>
      <play-comp class="my-choice" reveal="true" jugada=${
        state.getState().currentGame.myPlay
      } ></play-comp>
    `;
      this.className = "div-root";
    }
  }
);
