import { initWelcomePage } from "./pages/welcome";
import { initInstructionsPage } from "./pages/instructions";
import { initGamePage } from "./pages/game";
import { initRevealPage } from "./pages/reveal";
import { initPerdistePage } from "./pages/perdiste";
import { initGanastePage } from "./pages/ganaste";

const routes = [
  {
    path: /\/desafio-m5/,
    component: initWelcomePage,
  },
  {
    path: /\/welcome/,
    component: initWelcomePage,
  },
  {
    path: /\/instructions/,
    component: initInstructionsPage,
  },
  {
    path: /\/game/,
    component: initGamePage,
  },
  {
    path: /\/reveal/,
    component: initRevealPage,
  },
  {
    path: /\/perdiste/,
    component: initPerdistePage,
  },
  {
    path: /\/ganaste/,
    component: initGanastePage,
  },
];

export function initRouter(container: Element) {
  function goTo(path) {
    history.pushState({}, "", path);
    handleRoute(path);
  }
  function handleRoute(route) {
    for (const r of routes) {
      if (r.path.test(route)) {
        const el = r.component({ goTo: goTo });
        if (container.firstChild) {
          container.firstChild.remove();
        }
        container.appendChild(el);
      }
    }
  }

  if (location.pathname == "/") {
    goTo("/welcome");
  } else {
    handleRoute(location.pathname);
  }

  if (location.host.includes("github.io")) {
    goTo("/desafio-m5");
  }

  window.onpopstate = function () {
    handleRoute(location.pathname);
  };
}
