import { state } from "../../state";

export function initScoreComp() {
  customElements.define(
    "score-comp",
    class extends HTMLElement {
      shadow: ShadowRoot;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        const style = document.createElement("style");
        style.innerHTML = `

        h1, h2{
          margin: 0;
          font-weight: 300;
          max-height: 50px;
        }
        
        .score-board {
          overflow: hidden;
          border: solid 10px black;
          border-radius: 10px;
          width: 259px;
          height: 217px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          background-color: white;
          margin: auto;
          font-family: "Odibee sans";
          font-size: 45px;
          font-weight: 400;
        }
        
        .score-results{
          width: 94%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 30px;
          margin-bottom: 10px;
        }
        
        .player-and-score{
          display: flex;
          flex-direction: row;
        }
        
        .text{
          overflow:hidden;
          text-align:end;
        }
        
        .text.score{
          min-width: 50px;
          max-width:100px;
        }

        .score-title{
          height: 80px;
        }
        
        .button {
          margin: 0;
        }  
        `;

        this.shadow.appendChild(style);
        this.render();
      }
      render() {
        const score = state.getScores();
        const { rtdbData, player } = state.getState();
        const play1Name = rtdbData.currentGame.player1.name;
        const play2Name = rtdbData.currentGame.player2.name;
        const playerOneTrue = player == "player1";

        const div = document.createElement("div");
        div.innerHTML = `
        
        <div class="results__container"> 
          <div class="score-board">
            <h1 class="score-title">Score</h1>
            <div class="score-results">
              <div class="player-and-score">
                <h2 class="text">${playerOneTrue ? play1Name : play2Name}</h2>
                <h2 class="text score">: ${
                  playerOneTrue ? score.player1Score : score.player2Score
                }</h2>
              </div>
              <div class="player-and-score">
                <h2 class="text">${playerOneTrue ? play2Name : play1Name}</h2>
                <h2 class="text score">: ${
                  playerOneTrue ? score.player2Score : score.player1Score
                }</h2>
            </div>
          </div>
        </div>
        `;

        this.shadow.appendChild(div);
      }
    }
  );
}
