import { Router } from "@vaadin/router";

customElements.define(
  "nombre-page",
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
      <h2 class="rampart-font welcome__main-title ">Rock paper scissors</h2>
      <div class="welcome__button-container">
        <form>
          <label for="input-nombre" style="font-size:48px" class="odibee-font">tu nombre</label>
          <input-comp name="input-nombre" placeholder="nombre"></input-comp>
        </form>
        <button-comp class="button">start</button-comp>
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
