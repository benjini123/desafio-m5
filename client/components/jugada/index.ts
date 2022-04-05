const imagePaperURL = require("url:../../content/papel.png");
const imageRockURL = require("url:../../content/piedra.png");
const imageScissorsURL = require("url:../../content/tijera.png");

export function initPlayComp() {
  customElements.define(
    "play-comp",
    class extends HTMLElement {
      shadow: ShadowRoot;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        const style = document.createElement("style");
        const hoverable = this.hasAttribute("hover");

        if (hoverable) {
          style.innerHTML = `
          
          .hand{
            opacity: 0.8;
          }
          
          .hand:hover{
            opacity: 1;
            width: 100px;
          }
          
          `;
        }

        this.shadow.appendChild(style);
        this.render();
      }
      addListeners() {
        const handEl: any = this.shadow.querySelector(".hand");
        const reveal: any = this.hasAttribute("reveal");
        if (reveal) {
          handEl.style.width = "180px";
          handEl.style.height = "325px";
        }
      }
      render() {
        const jugada = this.getAttribute("jugada");

        var playType = "";
        if (jugada == "rock") {
          playType = imageRockURL;
        } else if (jugada == "paper") {
          playType = imagePaperURL;
        } else {
          playType = imageScissorsURL;
        }

        const div = document.createElement("div");

        div.innerHTML = `
          <div class="hand-cont">
            <img class="hand" src=${playType} >
          </div>
        `;

        this.shadow.appendChild(div);
        this.addListeners();
      }
    }
  );
}
