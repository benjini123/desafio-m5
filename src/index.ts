import { initRouter } from "../src/router";
import { initButtonComp } from "../src/components/button";
import { initPlayComp } from "../src/components/jugada";
import { initTimerComp } from "../src/components/timer";
import { state } from "./state";
import { initScoreComp } from "./components/score-board";

(function () {
  initButtonComp();
  initPlayComp();
  initTimerComp();
  initScoreComp();
  state.init();
  const rootEl = document.querySelector(".root");
  initRouter(rootEl);
})();
