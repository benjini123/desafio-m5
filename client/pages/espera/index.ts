import { Router } from "@vaadin/router";

customElements.define(
  "espera-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {
      const buttonEl = this.querySelector(".button-element");
      buttonEl.addEventListener("click", (e) => {
        e.preventDefault;
        Router.go("/instructions");
      });
    }
    render() {
      const codigo = "hi";
      this.innerHTML = `

      <h2 class="welcome__main-title rampart-font">Compartí el código:</h2>
      <h2>${codigo}</h2>
      <h2 class="welcome__main-title rampart-font">Con tu contrincante</h2>
      <form class="welcome__button-container">
        <input class="input-element" placeholder="codigo"></input>
        <button class="button-element">ingresar a una sala</button>
      </form>
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
