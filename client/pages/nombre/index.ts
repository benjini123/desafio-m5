import { Router } from "@vaadin/router";
import { state } from "../../state";

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
      const formEl = this.querySelector(".welcome__button-container");
      const buttonCompEl = this.querySelector(".button");
      const inputEl = this.querySelector(".input-element");

      formEl.addEventListener("submit", (e: any) => {
        e.preventDefault;
        console.log("Clicked");
        const name = e.target.input.value;
        state.setName(name);
        console.log(name);
        Router.go("/espera");
      });
    }
    render() {
      this.innerHTML = `
      <h2 class="rampart-font welcome__main-title ">Rock paper scissors</h2>
      <form class="welcome__button-container" >
        <div class="welcome__label-input-box">
          <label for="input" style="font-size:48px" class="odibee-font">tu nombre</label>
          <input id="input" name="input" class="input-element" placeholder="nombre"></input>
        </div>
        <button type="submit" class="button-element" >start</button>
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
