// Bouton « Copier » sur chaque bloc de commandes. La page reste complète sans script.
(() => {
  const fr = document.documentElement.lang === "fr";
  const labels = fr ? ["Copier", "Copié"] : ["Copy", "Copied"];
  for (const pre of document.querySelectorAll("pre")) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy";
    button.textContent = labels[0];
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector("code")?.textContent ?? pre.textContent);
        button.textContent = labels[1];
        setTimeout(() => { button.textContent = labels[0]; }, 1600);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(pre.querySelector("code") ?? pre);
        getSelection()?.removeAllRanges();
        getSelection()?.addRange(range);
      }
    });
    pre.append(button);
  }
})();
