import { Router } from "@vaadin/router";

customElements.define(
  "instructions-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {
      const buttonEl = this.querySelector(".button");
      buttonEl.addEventListener("click", (e) => {
        e.preventDefault;
        Router.go("/game");
      });
    }
    render() {
      this.innerHTML = `
      <h2 class="rampart-font welcome__main-title ">Press play and choose between the three options before the timer runs out..</h2>
      <button-comp class="button">start</button-comp>
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
