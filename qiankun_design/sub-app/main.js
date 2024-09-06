window.__CURRENT_APP__ = {
    bootstrap(props) {
      console.log('App bootstraped', props);
    },
    mount(props) {
      console.log('App mounted', props);
      document.getElementById('app').innerHTML = '<h1>Welcome to App 1</h1>';
    },
    unmount(props) {
      console.log('App unmounted', props);
      document.getElementById('app').innerHTML = '';
    }
  };
  