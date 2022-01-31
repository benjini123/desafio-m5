import { Router } from "@vaadin/router";

const greenStarURL = require("url:../../content/star-1.png");

customElements.define(
  "ganaste-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectecCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {
      const buttonEl = this.querySelector(".button");
      buttonEl.addEventListener("click", (e) => {
        e.preventDefault;
        Router.go("/instructions-page");
      });
    }
    render() {
      this.innerHTML = `

      <div class="results__container green">
        <div class="match-results__container">
          <img width="255px" src="${greenStarURL}">
          <div class="match-results__image-text">Victory!</div>
        </div>
        <score-comp></score-comp>
        <button class="button-element">replay</button>
      </div>

      
    `;
    }
  }
);
