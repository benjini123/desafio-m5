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
      }
      static get observedAttributes() {
        return ["disabled"];
      }
      get disabled() {
        return this.hasAttribute("disabled");
      }

      attributeChangedCallback(disabled) {
        if (this.disabled) {
          this.setAttribute("disabled", "");
        } else {
          this.removeAttribute("disabled");
        }
      }
    }
  );
}
