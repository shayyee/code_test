import { registerMicroApps, start } from './qiankun-framework/index.js';
import EventBus from './qiankun-framework/event-bus.js';

const eventBus = new EventBus();

registerMicroApps([
  {
    name: 'app1',
    entry: 'http://localhost:3001',
    container: '#container',
    activeRule: '/app1',
    props: { eventBus }
  },
  // {
  //   name: 'app2',
  //   entry: 'http://localhost:3002',
  //   container: '#container',
  //   activeRule: '/app2',
  //   props: { eventBus }
  // }
]);

start();
