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
    }
    addListeners() {
      const formEl = this.querySelector(".welcome__form-container");

      formEl.addEventListener("submit", (e: any) => {
        e.preventDefault();
        const name = e.target.input.value;
        this.querySelector(".loader").toggleAttribute("visible");
        // this.render();
        state.setName(name).then((userId) => {
          console.log(userId);
          //data.roomLongId
          state.setRoomLongId(userId).then((roomLongId) => {
            console.log(roomLongId);
            state.listenDatabase();
            state.setRoomShortId(roomLongId).then(() => {
              Router.go("/espera");
            });
          });
        });
      });
    }
    render() {
      this.innerHTML = `
      <h2 class="rampart-font welcome__main-title ">Rock paper scissors</h2>
      <loader-comp name="loader" class="loader" visible></loader-comp>
      <form class="welcome__form-container" >
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
      this.addListeners();
    }
  }
);
