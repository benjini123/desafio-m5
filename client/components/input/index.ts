export function initInputComp() {
  customElements.define(
    "input-comp",
    class extends HTMLElement {
      shadow = this.attachShadow({ mode: "open" });
      constructor() {
        super();
        this.render();
      }
      render() {
        const div = document.createElement("div");
        const style = document.createElement("style");

        div.innerHTML = `
        
        <input placeholder="${this.getAttribute(
          "placeholder"
        )}" class="input-element">${this.textContent}</input>
        `;

        style.innerHTML = `

        .input-element{
          height: 84px;
          max-width: 327px;
          width: 100%;
          font-family: "Odibee Sans";
          font-size: 45px;
          font-weight: 400;
          border: 10px solid #001997;
          border-radius: 10px;
          padding: 0;
        }
        `;

        this.shadow.appendChild(style);
        this.shadow.appendChild(div);
      }
    }
  );
}
