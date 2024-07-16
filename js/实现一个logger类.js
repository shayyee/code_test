class Logger {
    constructor() {
        this.task = Promise.resolve();
    }
  
    log(msg) {
      this.task = this.task.then(() => {
        console.log(msg)
      })
      return this;
    }
  
    sleep(time) {
      this.task = this.task.then(() => {
        return new Promise((resolve) => {
            setTimeout(resolve, time)
        })
      })
      return this
    }
  }

// class Logger {
//   constructor() {
//     this._queue = [];   // 任务队列
//     this._running = false; // 任务是否正在运行
//   }

//   log(msg) {
//     this._queue.push(() => {
//       return new Promise(resolve => {
//         resolve()
//       }).then(() => {
//         console.log(msg)
//       })
//     })
//     this._runTask();
//     return this;
//   }

//   sleep(time) {
//     this._queue.push(() => {
//       return new Promise(resolve => {
//         setTimeout(resolve, time);
//       }).then(() => {
//         console.log('wake up')
//       })
//     })
//     this._runTask();
//     return this;
//   }

//   async _runTask() {
//     if(this._queue.length > 0 && !this._running) {
//       this._running = true;
//       const task = this._queue.shift();
//       await task();
//       this._running = false;
//       this._runTask();
//     }
//   }
// }

const log1 = new Logger();
log1.log('log1').sleep(2000).log('log2');