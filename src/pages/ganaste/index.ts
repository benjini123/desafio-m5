const greenStarURL = require("url:../../content/star-1.png");

export function initGanastePage(params: any) {
  const div = document.createElement("div");
  div.className = "results__container green";

  div.innerHTML = `
    <div class="match-results__container  ">
      <img width="255px" src="${greenStarURL}">
      <div class="match-results__image-text">Victory!</div>
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
