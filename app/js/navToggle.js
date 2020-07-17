// const { ipcRenderer } = require('electron');

const nav = document.getElementById('nav');

ipcRenderer.on('nav:toggle', () => {
  nav.classList.toggle('hide');
});
