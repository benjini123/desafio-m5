import { Router } from "@vaadin/router";

customElements.define(
  "sala-page",
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
      this.innerHTML = `

      <h1 class="welcome__main-title rampart-font">Rock paper scissors!</h1>
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
