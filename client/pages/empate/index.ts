import { Router } from "@vaadin/router";
import { state } from "../../state";

const greenStarURL = require("url:../../content/star-1.png");

customElements.define(
  "empate-page",
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

        <div class="match-results__container">
          <img width="255px" >
          <div class="match-results__image-text black">Draw!</div>
        </div>
        <score-comp></score-comp>
        <div>
          <button class="button-element">replay</button>
        </div>
      `;
      this.className = "results__container";
    }
  }
);
