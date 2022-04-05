export function initLoaderComp() {
  customElements.define(
    "loader-comp",
    class extends HTMLElement {
      shadow: ShadowRoot;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        const style = document.createElement("style");
        style.innerHTML = `
          .loading {
            height: 0;
            width: 0;
            padding: 15px;
            border: 6px solid #ccc;
            border-right-color: #888;
            border-radius: 22px;
            -webkit-animation: rotate 1s infinite linear;
            left: 50%;
            top: 50%;
          }
          
          @-webkit-keyframes rotate {
            100% {
              -webkit-transform: rotate(360deg);
            }
          }`;

        this.shadow.appendChild(style);
        this.render();
      }
      render() {
        const div = document.createElement("div");

        div.innerHTML = `

        <div class="loading"></div>
        `;

        this.shadow.appendChild(div);
      }
    }
  );
}
