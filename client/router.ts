import { Router } from "@vaadin/router";

const rootEl = document.querySelector(".root");
const router = new Router(rootEl);
router.setRoutes([
  { path: "/", component: "welcome-page" },
  { path: "/welcome", component: "welcome-page" },
  { path: "/espera", component: "espera-page" },
  { path: "/instructions", component: "instructions-page" },
  { path: "/nombre", component: "nombre-page" },
  { path: "/sala", component: "sala-page" },
  { path: "/game", component: "game-page" },
  { path: "/reveal", component: "reveal-page" },
  { path: "/perdiste", component: "perdiste-page" },
  { path: "/ganaste", component: "ganaste-page" },
]);
