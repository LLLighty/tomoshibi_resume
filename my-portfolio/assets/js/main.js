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

const setupFeedbackWidget = () => {
  const widget = document.querySelector(".feedback-widget");
  if (!(widget instanceof HTMLElement)) return;

  const toggle = widget.querySelector(".feedback-toggle");
  const panel = widget.querySelector(".feedback-panel");
  const close = widget.querySelector(".feedback-close");
  const likeButton = widget.querySelector(".feedback-like-button");
  const input = widget.querySelector(".feedback-comment-input");
  const submit = widget.querySelector(".feedback-submit");
  const commentsRoot = widget.querySelector(".feedback-comments");
  const countNodes = widget.querySelectorAll(".feedback-like-count");
  if (!(toggle instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) return;

  const storageKey = "tomoshibi-home-feedback";
  const readState = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  };
  const writeState = (state) => localStorage.setItem(storageKey, JSON.stringify(state));
  const state = {
    liked: false,
    likes: 0,
    comments: [],
    ...readState(),
  };

  const render = () => {
    countNodes.forEach((node) => {
      node.textContent = String(state.likes || 0);
    });
    [toggle, likeButton].forEach((button) => {
      if (button instanceof HTMLButtonElement) {
        button.classList.toggle("is-liked", Boolean(state.liked));
      }
    });
    if (commentsRoot instanceof HTMLElement) {
      commentsRoot.innerHTML = "";
      const comments = Array.isArray(state.comments) ? state.comments.slice(-4).reverse() : [];
      comments.forEach((text) => {
        const item = document.createElement("p");
        item.className = "feedback-comment";
        item.textContent = text;
        commentsRoot.appendChild(item);
      });
    }
  };

  const setPanelOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  };

  const toggleLike = () => {
    state.liked = !state.liked;
    state.likes = Math.max(0, (state.likes || 0) + (state.liked ? 1 : -1));
    writeState(state);
    render();
  };

  toggle.addEventListener("click", () => setPanelOpen(panel.hidden));
  close?.addEventListener("click", () => setPanelOpen(false));
  likeButton?.addEventListener("click", toggleLike);
  submit?.addEventListener("click", () => {
    if (!(input instanceof HTMLTextAreaElement)) return;
    const text = input.value.trim();
    if (!text) return;
    state.comments = Array.isArray(state.comments) ? state.comments : [];
    state.comments.push(text.slice(0, 120));
    input.value = "";
    writeState(state);
    render();
  });

  render();
};

setupFeedbackWidget();
