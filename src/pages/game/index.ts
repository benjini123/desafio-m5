import { state } from "../../state";

export function initGamePage(params: any) {
  const div = document.createElement("div");
  const style = document.createElement("style");

  div.className = "div-root";
  div.innerHTML = `

  <timer-comp class="timer"></timer-comp>
  <div class="hands">
    <div>
      <play-comp id="1" class="hoverable-choice" jugada="rock" hover></play-comp>
    </div>
    <play-comp class="hoverable-choice" jugada="paper" hover></play-comp>
    <play-comp class="hoverable-choice" jugada="scissors" hover></play-comp>
  </div>
  `;

  const elementCollection = div.querySelectorAll(".hoverable-choice");
  elementCollection.forEach((ev) => {
    ev.addEventListener("click", (e) => {
      e.stopPropagation;
      const move = ev.getAttribute("jugada");
      if (move == "rock") {
        state.setMove("rock");
      } else if (move == "paper") {
        state.setMove("paper");
      } else {
        state.setMove("scissors");
      }

      params.goTo("/reveal");
    });
  });

  return div;
}
