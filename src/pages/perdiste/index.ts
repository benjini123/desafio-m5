const redStarURL = require("url:../../content/star-2.png");

export function initPerdistePage(params: any) {
  const div = document.createElement("div");
  div.className = "results__container red";

  div.innerHTML = `
    <div class="match-results__container ">
      <img width="255px" src="${redStarURL}">
      <div class="match-results__image-text">Defeat</div>
    </div>
    <score-comp></score-comp>
    <button-comp class="button" href="/instructions">replay</button-comp>
  `;

  const buttonEl = div.querySelector(".button");
  buttonEl.addEventListener("click", (e) => {
    e.preventDefault;
    const direction = buttonEl.getAttribute("href");
    params.goTo(direction);
  });

  return div;
}
