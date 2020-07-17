// const { ipcRenderer } = require('electron');

ipcRenderer.on('settings:get', (e, settings) => {
  document.getElementById('cpu-overload').value = settings.cpuOverload;
  document.getElementById('alert-frequency').value = settings.alertFrequency;
});

const settingsForm = document.getElementById('settings-form');

settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cpuOverload = document.getElementById('cpu-overload').value;
  const alertFrequency = document.getElementById('alert-frequency').value;
  ipcRenderer.send('settings:set', {
    cpuOverload,
    alertFrequency,
  });
  showAlert('Settings Saved');
});

function showAlert(msg) {
  const alert = document.getElementById('alert');
  alert.classList.remove('hide');
  alert.classList.add('alert');
  alert.innerText = msg;

  setTimeout(() => alert.classList.add('hide'), 3000);
}
