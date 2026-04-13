(function () {
  var SESSION_KEY = 'friction_player';
  var bar = document.getElementById('audio-player-bar');
  var heroBtn = document.getElementById('hero-play-btn');
  var ppBtn = document.getElementById('player-playpause');
  var icon = document.getElementById('player-icon');
  var closeBtn = document.getElementById('player-close');
  var progress = document.getElementById('player-progress');
  var audio = document.getElementById('friction-audio');

  if (!bar || !audio) return;

  var barVisible = false;

  function showBar() {
    bar.style.transform = 'translateY(0)';
    barVisible = true;
  }

  function hideBar() {
    bar.style.transform = 'translateY(100%)';
    barVisible = false;
    audio.pause();
    setIcon(false);
    clearSession();
  }

  function setIcon(playing) {
    icon.className = playing
      ? 'fa-solid fa-pause text-xs'
      : 'fa-solid fa-play text-xs ml-0.5';
    if (heroBtn) {
      var heroIcon = heroBtn.querySelector('i');
      if (heroIcon) heroIcon.className = playing ? 'fa-solid fa-pause text-sm' : 'fa-solid fa-play text-sm ml-0.5';
    }
  }

  // Seek and play, waiting for metadata if needed
  function seekAndPlay(seekTo) {
    function doPlay() {
      if (seekTo > 0) audio.currentTime = seekTo;
      audio.play().then(function () { setIcon(true); }).catch(function () { setIcon(false); });
    }
    if (audio.readyState >= 1) {
      doPlay();
    } else {
      audio.addEventListener('loadedmetadata', doPlay, { once: true });
    }
  }

  function saveSession() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        visible: barVisible,
        playing: !audio.paused,
        currentTime: audio.currentTime
      }));
    } catch (e) {}
  }

  function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  // Restore state from previous page in the same tab session
  (function restoreSession() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      var state = JSON.parse(raw);
      if (!state.visible) return;
      showBar();
      var seekTo = state.currentTime || 0;
      // Always restore position, play only if it was playing
      function doRestore() {
        if (seekTo > 0) audio.currentTime = seekTo;
        if (state.playing) {
          audio.play().then(function () { setIcon(true); }).catch(function () { setIcon(false); });
        }
      }
      if (audio.readyState >= 1) {
        doRestore();
      } else {
        audio.addEventListener('loadedmetadata', doRestore, { once: true });
      }
    } catch (e) {}
  })();

  // Save state on navigation (fires reliably for both normal links and back/forward)
  window.addEventListener('pagehide', saveSession);

  if (heroBtn) {
    heroBtn.addEventListener('click', function () {
      if (barVisible) {
        // Bar already open — toggle play/pause
        if (audio.paused) {
          audio.play().then(function () { setIcon(true); });
        } else {
          audio.pause();
          setIcon(false);
        }
      } else {
        // Fresh start from beginning
        showBar();
        seekAndPlay(0);
      }
    });
  }

  ppBtn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().then(function () { setIcon(true); });
    } else {
      audio.pause();
      setIcon(false);
    }
  });

  closeBtn.addEventListener('click', hideBar);

  function updateProgress() {
    if (!isFinite(audio.duration) || audio.duration <= 0) return;
    progress.style.width = (audio.currentTime / audio.duration * 100) + '%';
  }

  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('durationchange', updateProgress);
  audio.addEventListener('ended', function () { setIcon(false); });

  // Click on the progress track to seek
  var progressTrack = progress.parentNode;
  progressTrack.style.cursor = 'pointer';
  progressTrack.addEventListener('click', function (e) {
    if (!isFinite(audio.duration) || audio.duration <= 0) return; // no-op while duration unknown
    var rect = progressTrack.getBoundingClientRect();
    var seekTo = ((e.clientX - rect.left) / rect.width) * audio.duration;
    if (isFinite(seekTo) && seekTo >= 0 && seekTo <= audio.duration) audio.currentTime = seekTo;
  });

  // ── YouTube pause integration ──────────────────────────────────────────────
  // When the user clicks inside a YouTube iframe to play, focus moves into it
  // and window.blur fires. Check if the newly focused element is a YT iframe.
  window.addEventListener('blur', function () {
    var active = document.activeElement;
    if (!active || active.tagName !== 'IFRAME') return;
    var src = active.src || '';
    if (src.indexOf('youtube.com') === -1 && src.indexOf('youtube-nocookie.com') === -1) return;
    if (!audio.paused) {
      audio.pause();
      setIcon(false);
    }
  });
})();
