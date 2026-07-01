const copyContactValue = async (button) => {
  const value = button.dataset.copyValue;
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  const label = button.querySelector("small");
  if (!label) return;
  const originalText = label.dataset.originalText || label.textContent;
  label.dataset.originalText = originalText;
  label.textContent = "Copied";
  button.classList.add("is-copied");
  window.setTimeout(() => {
    label.textContent = originalText;
    button.classList.remove("is-copied");
  }, 1400);
};

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy-value]");
  if (button instanceof HTMLButtonElement) {
    copyContactValue(button);
  }
});
