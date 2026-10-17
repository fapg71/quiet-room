/* The Quiet Room — a small, build-free home for poems and music. */
(() => {
  "use strict";

  const content = window.QUIET_ROOM_CONTENT || {};
  const site = content.site || {};
  const byId = (id) => document.getElementById(id);
  const asText = (value) => value == null ? "" : String(value);
  const setText = (element, value) => {
    if (element) element.textContent = asText(value);
  };

  // Content stays as text; asset addresses allow ordinary files and web URLs.
  function safeAssetUrl(value) {
    const address = asText(value).trim();
    if (!address || /[\u0000-\u001f\u007f\\]/.test(address)) return "";
    if (/^https?:\/\//i.test(address)) {
      try {
        const url = new URL(address);
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
      } catch (_) {
        return "";
      }
    }
    if (/^[a-z][a-z\d+.-]*:/i.test(address) || address.startsWith("//")) return "";
    try {
      const url = new URL(address, document.baseURI);
      return ["file:", "http:", "https:"].includes(url.protocol) ? address : "";
    } catch (_) {
      return "";
    }
  }

  function safeWebUrl(value) {
    const address = asText(value).trim();
    if (!/^https?:\/\//i.test(address) || /[\u0000-\u001f\u007f]/.test(address)) return "";
    try {
      const url = new URL(address);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch (_) {
      return "";
    }
  }

  const poems = (Array.isArray(content.poems) ? content.poems : [])
    .filter((poem) => poem && typeof poem === "object")
    .map((poem, index) => ({
      id: asText(poem.id || `poem-${index + 1}`),
      title: asText(poem.title || "Untitled"),
      collection: asText(poem.collection),
      date: asText(poem.date),
      excerpt: asText(poem.excerpt),
      lines: Array.isArray(poem.lines) ? poem.lines.map(asText) : asText(poem.excerpt).split("\n"),
      note: asText(poem.note)
    }));

  const tracks = (Array.isArray(content.tracks) ? content.tracks : [])
    .filter((track) => track && typeof track === "object")
    .map((track, index) => ({
      id: asText(track.id || `track-${index + 1}`),
      title: asText(track.title || "Untitled recording"),
      subtitle: asText(track.subtitle),
      src: safeAssetUrl(track.src),
      artwork: safeAssetUrl(track.artwork),
      kind: asText(track.kind),
      durationLabel: asText(track.durationLabel)
    }));

  // Site identity and the short note from the writer.
  const siteName = asText(site.name || "The Quiet Room");
  document.querySelectorAll("[data-site-name]").forEach((element) => setText(element, siteName));
  document.querySelectorAll("[data-site-author]").forEach((element) => setText(element, site.author));
  document.querySelectorAll("[data-site-tagline]").forEach((element) => setText(element, site.tagline));
  document.querySelector(".wordmark")?.setAttribute("aria-label", `${siteName}, home`);
  document.title = `${siteName} — Poems & Music`;
  const description = document.querySelector('meta[name="description"]');
  if (description && site.description) description.setAttribute("content", asText(site.description));

  const heroTitle = byId("hero-title");
  if (heroTitle && Array.isArray(site.heroLines) && site.heroLines.length) {
    heroTitle.replaceChildren(...site.heroLines.map((line, index) => {
      const span = document.createElement("span");
      span.className = index === site.heroLines.length - 1 ? "hero-line hero-emphasis" : "hero-line";
      span.textContent = asText(line);
      return span;
    }));
  }
  setText(byId("hero-note"), site.heroNote);
  setText(byId("about-intro"), site.intro);
  const aboutCopy = byId("about-copy");
  if (aboutCopy && Array.isArray(site.about)) {
    aboutCopy.replaceChildren(...site.about.map((paragraph) => {
      const p = document.createElement("p");
      p.textContent = asText(paragraph);
      return p;
    }));
  }
  const sampleNotice = byId("sample-notice");
  if (sampleNotice) sampleNotice.hidden = !site.sampleContent;
  setText(byId("site-year"), new Date().getFullYear());

  const contactLink = byId("contact-link");
  if (contactLink) {
    const email = asText(site.email).trim();
    const validEmail = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email);
    contactLink.hidden = !validEmail;
    if (validEmail) contactLink.href = `mailto:${encodeURIComponent(email)}`;
    else contactLink.removeAttribute("href");
  }
  const socialLinks = byId("social-links");
  if (socialLinks) {
    const links = (Array.isArray(site.socials) ? site.socials : []).flatMap((social) => {
      if (!social || !social.label) return [];
      const href = safeWebUrl(social.url);
      if (!href) return [];
      const anchor = document.createElement("a");
      anchor.className = "social-link";
      anchor.href = href;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = asText(social.label);
      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = " ↗";
      anchor.append(arrow);
      return [anchor];
    });
    socialLinks.replaceChildren(...links);
    socialLinks.hidden = links.length === 0;
  }

  // The theme choice is optional; private/file browsing can reject storage.
  const themeToggle = byId("theme-toggle");
  function applyTheme(theme) {
    const dark = theme === "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(dark));
      themeToggle.setAttribute("aria-label", dark ? "Switch to daylight theme" : "Switch to lamplight theme");
    }
    setText(byId("theme-label"), dark ? "Daylight" : "Lamplight");
  }
  let savedTheme = "light";
  try {
    if (localStorage.getItem("quiet-room-theme") === "dark") savedTheme = "dark";
  } catch (_) { /* The site also works without browser storage. */ }
  applyTheme(savedTheme);
  themeToggle?.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    try { localStorage.setItem("quiet-room-theme", theme); } catch (_) { /* Optional preference. */ }
  });

  // Poems: collection and full-text search work together.
  const poemShelf = byId("poem-shelf");
  const poemFilters = byId("poem-filters");
  const poemSearch = byId("poem-search");
  let activeCollection = null;
  const filterButtons = [];
  const searchableText = (value) => asText(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();

  function renderPoems() {
    const query = searchableText(poemSearch?.value || "").trim();
    const visiblePoems = poems.filter((poem) => {
      const matchesCollection = activeCollection === null || poem.collection === activeCollection;
      const haystack = searchableText([poem.title, poem.collection, poem.excerpt, ...poem.lines].join("\n"));
      return matchesCollection && (!query || haystack.includes(query));
    });
    filterButtons.forEach(({ button, collection }) => {
      const selected = collection === activeCollection;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    setText(byId("poem-count"), `${visiblePoems.length} ${visiblePoems.length === 1 ? "poem" : "poems"}`);
    const empty = byId("poem-empty");
    if (empty) empty.hidden = visiblePoems.length !== 0;
    if (!poemShelf) return;

    poemShelf.replaceChildren(...visiblePoems.map((poem, visibleIndex) => {
      const card = document.createElement("article");
      card.className = visibleIndex === 0 ? "poem-card poem-card--featured" : "poem-card";
      const kicker = document.createElement("p");
      kicker.className = "poem-kicker";
      kicker.textContent = poem.collection;
      const title = document.createElement("h3");
      title.className = "poem-title";
      title.textContent = poem.title;
      const excerpt = document.createElement("p");
      excerpt.className = "poem-excerpt";
      excerpt.textContent = poem.excerpt || poem.lines.slice(0, 4).join("\n");
      const footer = document.createElement("div");
      footer.className = "poem-card-footer";
      const readButton = document.createElement("button");
      readButton.type = "button";
      readButton.className = "read-poem";
      readButton.textContent = "Read poem ↗";
      readButton.setAttribute("aria-label", `Read ${poem.title}`);
      readButton.addEventListener("click", () => openPoem(poems.indexOf(poem), { trigger: readButton }));
      const readingTime = document.createElement("span");
      readingTime.className = "reading-time";
      const wordCount = poem.lines.join(" ").split(/\s+/).filter(Boolean).length;
      readingTime.textContent = `${Math.max(1, Math.ceil(wordCount / 180))} min read`;
      footer.append(readButton, readingTime);
      card.append(kicker, title, excerpt, footer);
      return card;
    }));
  }

  if (poemFilters) {
    poemFilters.replaceChildren();
    const collections = [null, ...new Set(poems.map((poem) => poem.collection).filter(Boolean))];
    collections.forEach((collection) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-button";
      button.textContent = collection === null ? "All poems" : collection;
      button.setAttribute("aria-controls", "poem-shelf");
      button.addEventListener("click", () => {
        activeCollection = collection;
        renderPoems();
      });
      filterButtons.push({ button, collection });
      poemFilters.append(button);
    });
  }
  poemSearch?.addEventListener("input", renderPoems);
  byId("reset-poems")?.addEventListener("click", () => {
    activeCollection = null;
    if (poemSearch) poemSearch.value = "";
    renderPoems();
    poemSearch?.focus();
  });
  renderPoems();

  // A native dialog keeps the reading view keyboard-accessible and contained.
  const dialog = byId("poem-dialog");
  const readerTitle = byId("reader-title");
  const readerBody = byId("reader-body");
  const readerPrev = byId("reader-prev");
  const readerNext = byId("reader-next");
  const shareStatus = byId("reader-share-status");
  let currentPoemIndex = -1;
  let readerOpener = null;
  let previousBodyOverflow = "";
  let restoreHashOnClose = true;
  let pointerStartedOnBackdrop = false;

  function poemUrl(poem) {
    const url = new URL(window.location.href);
    url.hash = `poem=${encodeURIComponent(poem.id)}`;
    return url.href;
  }

  function replaceHash(hash) {
    try {
      const url = new URL(window.location.href);
      url.hash = hash;
      window.history.replaceState(window.history.state, "", url.href);
    } catch (_) { /* Some file viewers do not allow history changes. */ }
  }

  function renderReader() {
    const poem = poems[currentPoemIndex];
    if (!poem) return;
    setText(byId("reader-meta"), [poem.collection, poem.date].filter(Boolean).join(" · "));
    setText(readerTitle, poem.title);
    const stanzas = [];
    let stanza = [];
    poem.lines.forEach((line) => {
      if (line.trim() === "") {
        if (stanza.length) stanzas.push(stanza.join("\n"));
        stanza = [];
      } else {
        stanza.push(line);
      }
    });
    if (stanza.length) stanzas.push(stanza.join("\n"));
    readerBody?.replaceChildren(...stanzas.map((text) => {
      const p = document.createElement("p");
      p.className = "reader-stanza";
      p.textContent = text;
      return p;
    }));
    const note = byId("reader-note");
    if (note) {
      note.hidden = !poem.note;
      note.textContent = poem.note;
    }
    const sample = byId("reader-sample");
    if (sample) {
      sample.hidden = !site.sampleContent;
      if (!sample.textContent.trim()) sample.textContent = "Sample poem — replace this with your own writing.";
    }
    setText(byId("reader-position"), `${currentPoemIndex + 1} of ${poems.length}`);
    setText(shareStatus, "");
    if (readerPrev) {
      readerPrev.disabled = poems.length < 2;
      const previous = poems[(currentPoemIndex - 1 + poems.length) % poems.length];
      readerPrev.setAttribute("aria-label", `Previous poem: ${previous.title}`);
    }
    if (readerNext) {
      readerNext.disabled = poems.length < 2;
      const next = poems[(currentPoemIndex + 1) % poems.length];
      readerNext.setAttribute("aria-label", `Next poem: ${next.title}`);
    }
    if (dialog) dialog.scrollTop = 0;
  }

  function openPoem(index, { trigger = null, updateHash = true } = {}) {
    if (!dialog || !poems[index]) return;
    const wasOpen = dialog.open;
    if (!wasOpen) {
      readerOpener = trigger;
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    currentPoemIndex = index;
    renderReader();
    restoreHashOnClose = true;
    if (!wasOpen) {
      dialog.showModal();
      document.body.classList.add("reader-open");
    }
    if (readerTitle) {
      readerTitle.tabIndex = -1;
      readerTitle.focus({ preventScroll: true });
    }
    if (updateHash) replaceHash(`poem=${encodeURIComponent(poems[index].id)}`);
  }

  function closeReader({ restoreHash = true } = {}) {
    if (!dialog?.open) return;
    restoreHashOnClose = restoreHash;
    dialog.close();
  }

  readerPrev?.addEventListener("click", () => {
    if (currentPoemIndex >= 0 && poems.length > 1) openPoem((currentPoemIndex - 1 + poems.length) % poems.length);
  });
  readerNext?.addEventListener("click", () => {
    if (currentPoemIndex >= 0 && poems.length > 1) openPoem((currentPoemIndex + 1) % poems.length);
  });
  byId("reader-close")?.addEventListener("click", () => closeReader());
  dialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeReader();
  });
  dialog?.addEventListener("close", () => {
    document.body.style.overflow = previousBodyOverflow;
    document.body.classList.remove("reader-open");
    if (restoreHashOnClose) replaceHash("poetry");
    const focusTarget = readerOpener?.isConnected ? readerOpener : byId("poetry");
    if (focusTarget) {
      if (focusTarget === byId("poetry")) focusTarget.tabIndex = -1;
      focusTarget.focus({ preventScroll: focusTarget === readerOpener });
    }
    readerOpener = null;
    currentPoemIndex = -1;
    pointerStartedOnBackdrop = false;
    setText(shareStatus, "");
  });
  function outsideDialog(event) {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  }
  dialog?.addEventListener("pointerdown", (event) => {
    pointerStartedOnBackdrop = event.target === dialog && outsideDialog(event);
  });
  dialog?.addEventListener("pointercancel", () => { pointerStartedOnBackdrop = false; });
  dialog?.addEventListener("click", (event) => {
    if (pointerStartedOnBackdrop && event.target === dialog && outsideDialog(event)) closeReader();
    pointerStartedOnBackdrop = false;
  });
  byId("copy-poem-link")?.addEventListener("click", async () => {
    if (!poems[currentPoemIndex]) return;
    const url = poemUrl(poems[currentPoemIndex]);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard is unavailable");
      await navigator.clipboard.writeText(url);
      setText(shareStatus, "Link copied.");
    } catch (_) {
      setText(shareStatus, `Copy this address: ${url}`);
    }
  });

  function followPoemHash() {
    if (window.location.hash.startsWith("#poem=")) {
      let id = "";
      try { id = decodeURIComponent(window.location.hash.slice(6)); } catch (_) { /* Ignore malformed links. */ }
      const index = poems.findIndex((poem) => poem.id === id);
      if (index >= 0) {
        openPoem(index, { updateHash: false });
        return;
      }
    }
    if (dialog?.open) closeReader({ restoreHash: false });
  }
  window.addEventListener("hashchange", followPoemHash);

  // Music: one audio element, one active track, and no autoplay on page load.
  const audio = byId("audio");
  const musicPlayer = byId("music-player");
  const playerControls = byId("player-controls");
  const musicEmpty = byId("music-empty");
  const playerStatus = byId("player-status");
  const playToggle = byId("play-toggle");
  const playGlyph = byId("play-glyph");
  const seek = byId("seek");
  const muteToggle = byId("mute-toggle");
  const trackList = byId("track-list");
  const trackButtons = [];
  let currentTrackIndex = -1;
  let playbackRequest = 0;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const whole = Math.floor(seconds);
    const minutes = Math.floor(whole / 60);
    const remainder = String(whole % 60).padStart(2, "0");
    return minutes >= 60 ? `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}:${remainder}` : `${minutes}:${remainder}`;
  }

  function kindLabel(kind) {
    if (kind === "demo") return "Template demo";
    if (kind === "original") return "Original recording";
    return kind ? kind.charAt(0).toUpperCase() + kind.slice(1) : "Recording";
  }

  function updatePlaybackUI() {
    const playing = Boolean(audio && !audio.paused && !audio.ended);
    musicPlayer?.classList.toggle("is-playing", playing);
    if (playToggle) {
      const title = tracks[currentTrackIndex]?.title || "recording";
      playToggle.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${title}`);
      playToggle.setAttribute("aria-pressed", String(playing));
    }
    if (playGlyph) playGlyph.setAttribute("d", playing ? "M7 5h4v14H7zM14 5h4v14h-4z" : "M8 5v14l11-7Z");
    trackButtons.forEach(({ button, indicator }, index) => {
      const current = index === currentTrackIndex;
      button.classList.toggle("is-current", current);
      if (current) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
      indicator.textContent = current && playing ? "Playing" : current ? "Selected" : "";
    });
  }

  function updateProgress() {
    if (!audio) return;
    const duration = audio.duration;
    const canSeek = Number.isFinite(duration) && duration > 0;
    setText(byId("current-time"), formatTime(audio.currentTime));
    if (seek) {
      seek.disabled = !canSeek;
      seek.value = canSeek ? String(Math.round(audio.currentTime / duration * 1000)) : "0";
      seek.setAttribute("aria-valuetext", canSeek ? `${formatTime(audio.currentTime)} of ${formatTime(duration)}` : "Playback position unavailable");
    }
    if (canSeek) setText(byId("total-time"), formatTime(duration));
  }

  function updateMuteUI() {
    if (!audio) return;
    const muted = audio.muted || audio.volume === 0;
    if (muteToggle) {
      muteToggle.setAttribute("aria-pressed", String(muted));
      muteToggle.setAttribute("aria-label", muted ? "Unmute audio" : "Mute audio");
    }
    setText(byId("volume-label"), muted ? "Sound off" : "Sound on");
    musicPlayer?.classList.toggle("is-muted", muted);
  }

  async function playCurrentTrack() {
    if (!audio || !tracks[currentTrackIndex]?.src) {
      setText(playerStatus, "This recording is not available yet.");
      return;
    }
    const request = ++playbackRequest;
    setText(playerStatus, "");
    try {
      // Reload a source that previously failed so a manual retry can recover.
      if (audio.error) audio.load();
      await audio.play();
    } catch (error) {
      if (request !== playbackRequest || error.name === "AbortError") return;
      const message = error.name === "NotAllowedError"
        ? "Your browser paused playback. Press play to start the recording."
        : "This recording could not be played. Please try again or choose another track.";
      setText(playerStatus, message);
      updatePlaybackUI();
    }
  }

  function selectTrack(index, autoplay = false) {
    if (!audio || !tracks[index]) return;
    const track = tracks[index];
    if (index !== currentTrackIndex || audio.getAttribute("src") !== track.src) {
      ++playbackRequest;
      audio.pause();
      currentTrackIndex = index;
      setText(byId("track-title"), track.title);
      setText(byId("track-subtitle"), track.subtitle);
      setText(byId("track-kind"), kindLabel(track.kind));
      setText(byId("current-time"), "0:00");
      setText(byId("total-time"), track.durationLabel || "--:--");
      setText(playerStatus, "");
      if (seek) {
        seek.value = "0";
        seek.disabled = true;
        seek.setAttribute("aria-valuetext", "Playback position unavailable");
      }
      const art = byId("player-art");
      if (art) {
        art.hidden = !track.artwork;
        art.alt = `Artwork for ${track.title}`;
        if (track.artwork) art.src = track.artwork;
        else art.removeAttribute("src");
      }
      if (playToggle) playToggle.disabled = !track.src;
      if (track.src) audio.src = track.src;
      else audio.removeAttribute("src");
      audio.load();
      if (!track.src) setText(playerStatus, "This recording is not available yet.");
      updatePlaybackUI();
    }
    if (autoplay) void playCurrentTrack();
  }

  if (playerControls) playerControls.hidden = tracks.length === 0;
  if (musicEmpty) musicEmpty.hidden = tracks.length !== 0;
  if (seek) {
    seek.min = "0";
    seek.max = "1000";
    seek.step = "1";
    seek.disabled = true;
  }
  if (trackList) {
    trackList.replaceChildren(...tracks.map((track, index) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "track-row";
      button.setAttribute("aria-label", `Play ${track.title}`);
      const number = document.createElement("span");
      number.className = "track-index";
      number.textContent = String(index + 1).padStart(2, "0");
      const copy = document.createElement("span");
      copy.className = "track-row-copy";
      const title = document.createElement("span");
      title.className = "track-row-title";
      title.textContent = track.title;
      const kind = document.createElement("span");
      kind.className = "track-row-kind";
      kind.textContent = kindLabel(track.kind);
      copy.append(title, kind);
      const duration = document.createElement("span");
      duration.className = "track-duration";
      duration.textContent = track.durationLabel;
      const indicator = document.createElement("span");
      indicator.className = "track-indicator";
      indicator.setAttribute("aria-hidden", "true");
      button.append(number, copy, duration, indicator);
      button.addEventListener("click", () => selectTrack(index, true));
      trackButtons.push({ button, indicator });
      li.append(button);
      return li;
    }));
  }

  if (audio) {
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("durationchange", updateProgress);
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("play", updatePlaybackUI);
    audio.addEventListener("pause", () => {
      if (playerStatus?.textContent === "Loading recording…") setText(playerStatus, "");
      updatePlaybackUI();
    });
    audio.addEventListener("playing", () => { setText(playerStatus, ""); updatePlaybackUI(); });
    audio.addEventListener("waiting", () => { if (!audio.paused) setText(playerStatus, "Loading recording…"); });
    audio.addEventListener("volumechange", updateMuteUI);
    audio.addEventListener("ended", () => {
      if (currentTrackIndex + 1 < tracks.length) {
        selectTrack(currentTrackIndex + 1, true);
      } else {
        ++playbackRequest;
        audio.pause();
        try { audio.currentTime = 0; } catch (_) { /* An unloaded source cannot seek. */ }
        updateProgress();
        updatePlaybackUI();
        setText(playerStatus, "Finished playing.");
      }
    });
    audio.addEventListener("error", () => {
      const code = audio.error?.code;
      if (!tracks[currentTrackIndex]?.src) return;
      setText(playerStatus, code === 3
        ? "Your browser could not decode this recording. Please try another track."
        : code === 4
          ? "This recording is unavailable or uses a format your browser cannot play."
          : "This recording could not be loaded. Please try again or choose another track.");
      if (seek) seek.disabled = true;
      updatePlaybackUI();
    });
    playToggle?.addEventListener("click", () => {
      if (audio.paused || audio.ended) {
        if (audio.ended) {
          try { audio.currentTime = 0; } catch (_) { /* Playback handles source errors. */ }
        }
        void playCurrentTrack();
      } else {
        ++playbackRequest;
        audio.pause();
      }
    });
    seek?.addEventListener("input", () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      try {
        audio.currentTime = Number(seek.value) / 1000 * audio.duration;
        updateProgress();
      } catch (_) {
        setText(playerStatus, "Seeking is not available for this recording yet.");
      }
    });
    muteToggle?.addEventListener("click", () => {
      audio.muted = !(audio.muted || audio.volume === 0);
      if (!audio.muted && audio.volume === 0) audio.volume = 1;
      updateMuteUI();
    });
    updateMuteUI();
    if (tracks.length) selectTrack(0);
    else if (playToggle) playToggle.disabled = true;
  }

  followPoemHash();
})();
