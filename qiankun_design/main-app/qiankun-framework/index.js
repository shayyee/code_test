import { loadHTML } from './html-loader.js';
import { createSandbox } from './sandbox.js';

const apps = [];
let activeApp = null;

export function registerMicroApps(appList) {
  apps.push(...appList);
}

export function start() {
  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();
}

async function handleRouteChange() {
  const { hash } = window.location;
  const newActiveApp = apps.find(app => hash.startsWith(`#${app.activeRule}`));
  
  if (newActiveApp) {
    if (activeApp && activeApp.name !== newActiveApp.name) {
      activeApp.unmount();
    }
    
    if (activeApp !== newActiveApp) {
      const { entry, container, props } = newActiveApp;
      const appContent = await loadHTML(entry);
      document.querySelector(container).innerHTML = appContent;
      const sandbox = createSandbox();
      sandbox.execScripts(entry, props);
      activeApp = newActiveApp;
    }
  }
}
