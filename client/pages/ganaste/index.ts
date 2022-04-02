import { Router } from "@vaadin/router";
import { state } from "../../state";

const greenStarURL = require("url:../../content/star-1.png");

customElements.define(
  "ganaste-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
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
          <img width="255px" src="${greenStarURL}">
          <div class="match-results__image-text">Victory!</div>
        </div>
        <score-comp></score-comp>
        <button class="button-element">replay</button>
        
    `;
      this.className = "results__container green";
      this.addListeners();
    }
  }
);
