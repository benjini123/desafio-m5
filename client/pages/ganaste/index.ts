import { Router } from "@vaadin/router";

const greenStarURL = require("url:../../content/star-1.png");

class Victory extends HTMLElement {
  connectecCallback() {
    this.render();
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

    <div class="esults__container green">
      <div class="match-results__container  ">
        <img width="255px" src="${greenStarURL}">
        <div class="match-results__image-text">Victory!</div>
      </div>
      <score-comp></score-comp>
      <button-comp class="button">replay</button-comp>
    </div>
    `;
  }
}
customElements.define("ganaste-page", Victory);
