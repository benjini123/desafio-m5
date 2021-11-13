import { state } from "../../state";

export function initRevealPage(params: any) {
  const div = document.createElement("div");

  div.className = "div-root";
  div.innerHTML = `

    <play-comp class="computer-choice" reveal="true" jugada=${
      state.getState().currentGame.computerPlay
    }></play-comp>
    <play-comp class="my-choice" reveal="true" jugada=${
      state.getState().currentGame.myPlay
    } ></play-comp>

  `;

  const computerPlay = div
    .querySelector(".computer-choice")
    .getAttribute("jugada");

  const myPlay = div.querySelector(".my-choice").getAttribute("jugada");

  setTimeout(() => {
    const results = state.whoWins(myPlay, computerPlay);
    if (results == 2) {
      params.goTo("/game");
    } else if (results == 1) {
      params.goTo("/perdiste");
    } else {
      params.goTo("/ganaste");
    }
  }, 3000);

  return div;
}
