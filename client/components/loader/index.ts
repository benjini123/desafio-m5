import * as e from "express";
import { state } from "../../state";

export function initLoaderComp() {
  customElements.define(
    "loader-comp",
    class extends HTMLElement {
      shadow: ShadowRoot;
      // active: Boolean = false;
      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        const style = document.createElement("style");
        style.innerHTML = `
        .loader {
          border: 16px solid #f3f3f3; 
          border-top: 16px solid #3498db;
          border-radius: 50%;
          width: 120px;
          height: 120px;
          animation: spin 2s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        `;

        this.shadow.appendChild(style);
      }
      render() {
        const div = document.createElement("div");

        div.innerHTML = `
        <div class="loader"></div>
        `;

        let loader: any = div.querySelector(".loader");
        if (this.getAttribute("visible") == "true") {
          console.log("it is supposed to be shown ");
          this.hidden = false;
          this.render();
        } else {
          this.hidden = true;
        }

        this.shadow.appendChild(div);
      }
      static get observedAttributes() {
        return ["visible"];
      }

      get visible() {
        return this.hasAttribute("visible");
      }

      set visible(val) {
        if (val) {
          this.setAttribute("disabled", "");
        } else {
          this.removeAttribute("disabled");
        }
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (this.visible) {
          this.setAttribute("visible", "true");
        } else {
          this.setAttribute("visible", "false");
        }
      }
    }
  );
}
