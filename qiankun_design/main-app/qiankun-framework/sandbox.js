import cacheManager from './local-storage-cache-manager.js';

export function createSandbox() {
  const sandbox = {
    async execScripts(entry, props) {
      const mainScriptUrl = `${entry}/main.js`;
      const scriptContent = await cacheManager.get(mainScriptUrl);

      const scriptFunction = new Function('props', scriptContent);
      scriptFunction(props);

      window.__CURRENT_APP__.bootstrap(props);
      window.__CURRENT_APP__.mount(props);
    }
  };
  return sandbox;
}
