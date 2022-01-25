import { initButtonComp } from "./components/button";
import { initInputComp } from "./components/input";
import { initPlayComp } from "./components/jugada";
import { initTimerComp } from "./components/timer";
import { state } from "./state";
import { initScoreComp } from "./components/score-board";
import "./router";
import "./pages/welcome";
import "./pages/instructions";
import "./pages/game";
import "./pages/reveal";
import "./pages/ganaste";
import "./pages/perdiste";
import "./pages/sala";
import "./pages/nombre";

(function () {
  initButtonComp();
  initInputComp();
  initPlayComp();
  initTimerComp();
  initScoreComp();
  state.init();
})();
