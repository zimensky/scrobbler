chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "knockknock");
  port.onMessage.addListener(function(msg) {
    if (msg.current && msg.duration) {
      msg.progressC = `${timeToNumber(msg.current)}/${timeToNumber(msg.duration)}`;
    }
    console.log(msg);
  });
});

function timeToNumber(time) {
  const [min, sec] = time.split(":");

  return parseInt(min, 10) * 60 + parseInt(sec, 10);
}