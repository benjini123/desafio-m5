export function initButtonComp() {
  customElements.define(
    "button-comp",
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
        
        <button class="button-element" href="${this.getAttribute("href")}">${
          this.innerText
        }</button>
        `;

        style.innerHTML = `

        .button-element{
          background-color: #006CFC;
          height: 87px;
          width: 322px;
          font-family: "Odibee Sans";
          font-size: 45px;
          font-weight: 400;
          border: 10px solid #001997;
          border-radius: 10px;
          color: #D8FCFC;
        }
        `;

        this.shadow.appendChild(style);
        this.shadow.appendChild(div);
      }
    }
  );
}
