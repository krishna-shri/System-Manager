const osu = require('node-os-utils');
const { ipcRenderer } = require('electron');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;
const { dialog } = require('electron').remote;

let cpuOverload;
let alertFrequency;

ipcRenderer.on('settings:get', (e, settings) => {
  (cpuOverload = +settings.cpuOverload),
    (alertFrequency = +settings.alertFrequency);
});

setInterval(() => {
  cpu.usage().then((i) => {
    document.getElementById('cpu-usage').innerText = `${i}%`;
    document.getElementById('cpu-progress').style.width = i + '%';
    if (i > cpuOverload) {
      document.getElementById('cpu-progress').style.background = 'red';
    } else {
      document.getElementById('cpu-progress').style.background = '#30c88b';
    }
    if (i > cpuOverload && runNotify(alertFrequency)) {
      notifyUser({
        message: 'CPU Overload',
        detail: `CPU is over ${cpuOverload}%`,
      });
      localStorage.setItem('lastNotify', +new Date());
    }
  });
  cpu
    .free()
    .then((i) => (document.getElementById('cpu-free').innerText = `${i}%`));

  document.getElementById('sys-uptime').innerText = secsToUp(os.uptime());
}, 2000);

document.getElementById('cpu-model').innerText = cpu.model();

document.getElementById('comp-name').innerText = os.hostname();

document.getElementById('os').innerText = `${os.type()} ${os.arch()}`;

mem
  .info()
  .then((i) => (document.getElementById('mem-total').innerText = i.totalMemMb));

const secsToUp = (sec) => {
  sec = +sec;
  const d = Math.floor(sec / (3600 * 24));
  const h = Math.floor((sec % (3600 * 24)) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${d} Days, ${h} Hours, ${m} Minutes, ${s} Seconds`;
};

function notifyUser(options) {
  dialog.showMessageBox(null, options);
}

function runNotify(freq) {
  if (localStorage.getItem('lastNotify') === null) {
    localStorage.setItem('lastNotify', +new Date());
    return true;
  }
  const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')));
  const now = new Date();
  const diff = Math.abs(now - notifyTime);
  const minsPassed = Math.ceil(diff / (1000 * 60));

  if (minsPassed > freq) {
    return true;
  } else return false;
}
