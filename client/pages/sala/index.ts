import { Router } from "@vaadin/router";
import { state } from "../../state";

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
      const loaderEl = this.querySelector<HTMLElement>(".loader");
      const formEl = this.querySelector<HTMLElement>(
        ".welcome__form-container"
      );
      formEl.addEventListener("submit", (e: any) => {
        e.preventDefault();
        formEl.style.display = "none";
        loaderEl.style.display = "initial";
        const name = e.target.nombre.value;
        const shortId = e.target.codigo.value;
        state
          .verifyRoom(shortId)
          .then((data) => {
            const owner = data.owner;
            state.listenDatabase();
            state
              .verifyPlayer(name, owner)
              .then(() => {
                setTimeout(() => {
                  Router.go("/espera");
                }, 1000);
              })
              .catch((error) => {
                formEl.style.display = "flex";
                loaderEl.style.display = "none";
                alert(error.message);
              });
          })
          .catch((error) => {
            formEl.style.display = "flex";
            loaderEl.style.display = "none";
            alert(error.message);
          });
      });
    }
    render() {
      this.innerHTML = `

      <h1 class="welcome__main-title rampart-font">Rock paper scissors!</h1>
      <loader-comp name="loader" class="loader"></loader-comp>
      <form class="welcome__form-container">
        <input name="nombre" class="input-element" placeholder="nombre"></input>
        <input name="codigo" class="input-element" placeholder="codigo"></input>
        <button type="submit" class="button-element">ingresar a una sala</button>
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
