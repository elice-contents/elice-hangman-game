import { ATTEMPTS } from "./constants.js";
import { makeElementInvisible, makeElementVisible } from "./utils.js";
import Game from "./game.js";

class System {
  // 게임 시스템 상태 프로퍼티
  #count;

  // DOM 요소 프로퍼티
  triesElement = document.getElementById("tries");
  startTextElement = document.getElementById("startText");
  startButtonElement = document.getElementById("startButton");
  failTextElement = document.getElementById("failText");
  restartButtonElement = document.getElementById("restartButton");
  successTextElement = document.getElementById("successText");
  overTextElement = document.getElementById("overText");

  constructor() {
    // 시스템 시작 프로퍼티 세팅
    this.#count = ATTEMPTS;

    // 시스템 시작 DOM 세팅
    this.triesElement.innerText = this.#count;
    makeElementVisible(this.startTextElement);
    this.startButtonElement.addEventListener("click", this.#start);
    this.restartButtonElement.addEventListener("click", this.#restart);
  }

  // 시도 횟수 1회 차감 및 DOM 업데이트
  #decreaseCount() {
    this.#count--;
    this.triesElement.innerText = this.#count;
  }

  // 시도 횟수 남아있는 경우 새 게임 시작
  #gameStart = async () => {
    this.#decreaseCount();
    const result = await new Game();

    // 게임 성공 여부 확인
    if (result) {
      // 게임 성공 시 -> "성공했습니다"
      makeElementVisible(this.successTextElement);
    } else {
      // 게임 실패했으나 시도 횟수 남아있는 경우 -> "실패했습니다"
      if (this.#count > 0) makeElementVisible(this.failTextElement);
      // 게임 실패 및 시도 횟수 남아있지 않은 경우 -> "기회를 모두 사용했습니다"
      else makeElementVisible(this.overTextElement);
    }
  };

  // "시작하기" 버튼 이벤트
  #start = () => {
    makeElementInvisible(this.startTextElement);
    this.#gameStart();
  };

  // "다시 시작" 버튼 이벤트
  #restart = () => {
    makeElementInvisible(this.failTextElement);
    this.#gameStart();
  };

  // 시스템 clean up
  cleanup() {
    this.triesElement.innerText = ATTEMPTS;

    this.startButtonElement.removeEventListener("click", this.#start);
    this.restartButtonElement.removeEventListener("click", this.#restart);
    makeElementInvisible(this.successTextElement);
    makeElementInvisible(this.overTextElement);
  }
}

export default System;
