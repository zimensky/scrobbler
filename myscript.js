var port = chrome.runtime.connect({name: "knockknock"});
// port.onMessage.addListener(function(msg) {});

const PLAY_ID = "player-bar-play-pause";
let playBtnObserver = null;

function startObserver(nodeId) {
  if (playBtnObserver) return playBtnObserver;

  const node = document.getElementById(nodeId);
  if (node) {
    const config = { attributes: true, childList: false };
    const observer = new MutationObserver(mutationList => {
      for (let mutation in mutationList) {
        // Seems it doesn't happen
        if (mutation.type === "attributes") {
          port.postMessage({ mutation });
        }
      }
      port.postMessage({ mutationList });
    });
    observer.observe(node, config);

    return observer;
  }

  return null;
}

function runner() {
  if (!playBtnObserver) {
    playBtnObserver = startObserver(PLAY_ID);
  }

  const TITLE_ID = "currently-playing-title";
  const ARTIST_ID = "player-artist";
  const ALBUM_CLASS = "player-album";
  const CURRENT_ID = "time_container_current";
  const DURATION_ID = "time_container_duration";
  const PROGRESS_ID = "material-player-progress";

  const title = document.getElementById(TITLE_ID);
  const artist = document.getElementById(ARTIST_ID);
  const album = document.getElementsByClassName(ALBUM_CLASS);
  const current = document.getElementById(CURRENT_ID);
  const duration = document.getElementById(DURATION_ID);
  const progress = document.getElementById(PROGRESS_ID);

  let data = {};

  if (title) {
    data.title = title.innerText;
  }

  if (artist) {
    data.artist = artist.innerText;
  }

  if (album && album[0]) {
    data.album = album[0].innerText;
  }

  if (current) {
    data.current = current.innerText;
  }

  if (duration) {
    data.duration = duration.innerText;
  }

  // This won't work if Google Play tab isn't in a focus
  if (progress) {
    const valueNow = progress.attributes["aria-valuenow"];
    const valueMax = progress.attributes["aria-valuemax"];

    let progressData = {};
    if (valueNow) {
      progressData.now = parseInt(valueNow.value, 10);
    }
    if (valueMax) {
      progressData.max = parseInt(valueMax.value, 10);
    }

    data.progress = progressData;
  }

  // That's not a guarantee of track playing
  if (title) {
    port.postMessage(data);
  }
}

setInterval(runner, 1000);