const playbackRates = [1, 1.5, 2, 3];

document.querySelectorAll("video[controls]").forEach((video) => {
  const controls = document.createElement("div");
  controls.className = "video-playback";
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", "播放速度");

  const label = document.createElement("span");
  label.textContent = "播放速度";
  label.setAttribute("aria-hidden", "true");
  controls.append(label);

  for (const rate of playbackRates) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pixel-button";
    button.textContent = `${rate}×`;
    const updateSelection = () => {
      button.setAttribute("aria-pressed", String(video.playbackRate === rate));
    };

    button.addEventListener("click", () => {
      video.playbackRate = rate;
    });
    video.addEventListener("ratechange", updateSelection);
    updateSelection();
    controls.append(button);
  }

  video.after(controls);
});
