export function initWelcomePage(params: any) {
  const div = document.createElement("div");
  div.className = "div-root";
  div.innerHTML = `
  
  <h1 class="welcome__main-title rampart-font"> Rock paper scissors!</h1>
  <button-comp class="button" href="/instructions">start</button-comp>
  <div class="hands">
    <play-comp jugada="rock"></play-comp>
    <play-comp jugada="paper"></play-comp>
    <play-comp jugada="scissors"></play-comp>
  </div>
  `;

  const buttonEl = div.querySelector(".button");
  buttonEl.addEventListener("click", (e) => {
    e.preventDefault;
    const direction = buttonEl.getAttribute("href");
    params.goTo(direction);
  });

  return div;
}
