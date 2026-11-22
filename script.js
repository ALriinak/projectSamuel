const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const bars = document.querySelector(".sound-bars");
if (bars) {
  for (let i = 0; i < 31; i++) {
    const bar = document.createElement("span");
    const height = 18 + Math.abs(Math.sin(i * 0.63) * 92) + Math.abs(Math.cos(i * 0.19) * 38);
    bar.style.height = `${height}px`;
    bars.appendChild(bar);
  }
}

const experimentButton = document.querySelector("#experiment");
const screen = document.querySelector("#experimentScreen");
const status = document.querySelector("#experimentStatus");
const symbol = document.querySelector(".screen-symbol");
const messages = [
  ["SIGNAL DETECTED", "✳"],
  ["IDEA GENERATOR ONLINE", "✦"],
  ["UNNECESSARY SCIENCE", "⌁"],
  ["SUCCESSFULLY PRESSED", "✳"],
  ["THE VIBES ARE CORRECT", "☼"]
];
let runCount = 0;

experimentButton?.addEventListener("click", () => {
  runCount++;
  const [message, glyph] = messages[(runCount - 1) % messages.length];
  status.textContent = "RUN " + String(runCount).padStart(3, "0");
  screen.querySelector("strong").textContent = message;
  screen.querySelector("small").textContent = "EXPERIMENT COMPLETE // NO FURTHER ACTION";
  symbol.textContent = glyph;
  symbol.animate(
    [{ transform: "rotate(0deg) scale(.6)", opacity: .2 }, { transform: "rotate(180deg) scale(1.3)", opacity: 1 }, { transform: "rotate(360deg) scale(1)", opacity: 1 }],
    { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)" }
  );
});
