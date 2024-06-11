export function makeElementVisible(element) {
  element.classList.add("flex-visible");
  element.classList.remove("invisible");
}

export function makeElementInvisible(element) {
  element.classList.remove("flex-visible");
  element.classList.add("invisible");
}
