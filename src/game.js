import { ANSWERS, TIME_LIMIT } from "./constants.js";
import { makeElementInvisible, makeElementVisible } from "./utils.js";

class Game {
  // 타이머 관련 프로퍼티
  #timerCount;
  #timerId;

  // 정답 및 현재 정답 여부 관리
  #currentStage;
  #answer;
  #problemText;

  // DOM 요소 프로퍼티
  hangmanElements = document.querySelectorAll(".canvas > img");
  timerElement = document.getElementById("timer");
  problemTextElement = document.getElementById("problemText");
  answerTextElement = document.getElementById("answerText");
  alphabetButtonElements = document.querySelectorAll(".alphabets > button");
  alphabetEventListeners = [];

  constructor() {
    // 게임 시작 프로퍼티 세팅
    this.#timerCount = TIME_LIMIT;
    this.#currentStage = 0;
    this.#answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    console.log(this.#answer);
    this.#problemText = this.#answer
      .split("")
      .reduce((acc, cur) => (cur === " " ? acc + " " : acc + "_"), "");

    // 게임 시작 DOM 세팅
    this.timerElement.innerText = this.#timerCount;
    this.problemTextElement.innerText = this.#problemText;
    makeElementVisible(this.problemTextElement);
    this.answerTextElement.innerText = `정답: ${this.#answer}`;
    makeElementInvisible(this.answerTextElement);

    // 게임 결과 반환 프로미스 생성
    return new Promise((resolve) => {
      // 타이머 설정, 0초 도달 시 game over, 프로미스는 false를 resolve
      this.#timerId = setInterval(() => {
        if (this.#timerCount <= 0) resolve(false);
        else this.#decreaseTimerCount();
      }, 1000);

      // 알파벳 버튼 입력 이벤트 등록
      this.alphabetButtonElements.forEach((element) => {
        const onClick = () => {
          this.#clickAlphabet(element, resolve);
          element.removeEventListener("click", onClick);
        };
        this.alphabetEventListeners.push(onClick);
        element.addEventListener("click", onClick);
      });
    }).then(this.#gameOver);
  }

  #clickAlphabet = (element, resolve) => {
    // 버튼 요소 투명도 설정 및 비활성화
    element.classList.add("button-invisible");
    element.removeEventListener("click", () =>
      this.#clickAlphabet(element, resolve)
    );

    // 클릭한 알파벳 포함 여부 확인
    if (this.#answer.includes(element.innerText)) {
      this.#updateProblemText(element.innerText);
      // 전체 정답 맞추면 game over, 프로미스는 true를 resolve
      if (this.#problemText === this.#answer) resolve(true);
    } else {
      // 아직 행맨이 완성되기 전이라면 다음 stage로 넘어감
      if (this.#currentStage < this.hangmanElements.length - 1)
        this.#nextStage();
      // 행맨이 완성되었다면 game over, 프로미스는 false를 resolve
      else resolve(false);
    }
  };

  // 타이머 1초 감소 및 DOM 업데이트
  #decreaseTimerCount() {
    this.#timerCount--;
    this.timerElement.innerText = this.#timerCount;
  }

  // currentStage 1 증가 및 행맨 이미지 추가
  #nextStage() {
    this.#currentStage++;
    Array.from(this.hangmanElements)
      .slice(0, this.#currentStage)
      .forEach((element) => element.classList.remove("invisible"));
  }

  // 알파벳 입력으로 인한 problemText 업데이트
  #updateProblemText(newAlphabet) {
    this.#problemText = this.#problemText
      .split("")
      .reduce((acc, cur, index) => {
        if (cur === " " || cur !== "_") return acc + cur;
        if (this.#answer[index] === newAlphabet) return acc + newAlphabet;
        else return acc + "_";
      }, "");
    this.problemTextElement.innerText = this.#problemText;
  }

  // 게임 오버, 게임 실패 시 false / 성공 시 true 반환
  #gameOver = (result) => {
    // 타이머 삭제
    clearInterval(this.#timerId);

    // 정답 보여주기
    makeElementVisible(this.answerTextElement);

    // DOM 상태 초기화
    this.hangmanElements.forEach((element) =>
      element.classList.add("invisible")
    );
    makeElementInvisible(this.problemTextElement);
    this.alphabetButtonElements.forEach((element, index) => {
      element.classList.remove("button-invisible");
      element.removeEventListener("click", this.alphabetEventListeners[index]);
    });

    return result;
  };
}

export default Game;
