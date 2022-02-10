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

      formEl.addEventListener("submit", (e: any) => {
        e.preventDefault;
        const name = e.target.input.value;
        console.log(name);
        const userId = state.setName(name);
        userId.then((data) => {
          console.log("hi", data);
          return data;
        });

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
