/**
 * 1. 构造函数
 * 2. 状态及原因
 * 3. then方法
 * 4. 异步任务
 * 5. 链式编程(返回新的promise实例，获取返回值处理异常；处理then中返回Promise的情况; 处理重复引用)
 */
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  state = PENDING;
  result = undefined;

  #onFulfilledCallbacks = [];
  #onRejectedCallbacks = [];

  constructor(fn) {
    let _resolve = (val) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.result = val;
        this.#onFulfilledCallbacks.forEach((cb) => cb());
      }
    };

    let _reject = (val) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.result = val;
        this.#onRejectedCallbacks.forEach((cb) => cb());
      }
    };

    try {
      fn(_resolve, _reject);
    } catch (err) {
      // console.log(err)
      _reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (val) => {
            throw val;
          };
    const p2 = new MyPromise((resolve, reject) => {
      if (this.state === FULFILLED) {
        runAsyncTask(() => {
          try {
            const x = onFulfilled(this.result);
            // 处理返回值
            resolvePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.state === REJECTED) {
        runAsyncTask(() => {
          try {
            const x = onRejected(this.result);
            resolvePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else {
        this.#onFulfilledCallbacks.push(() => {
          runAsyncTask(() => {
            try {
              const x = onFulfilled(this.result);
              resolvePromise(p2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.#onRejectedCallbacks.push(() => {
          runAsyncTask(() => {
            try {
              const x = onRejected(this.result);
              resolvePromise(p2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });
    return p2;
  }
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  finally(onFinally) {
    return this.then(onFinally, onFinally);
  }
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }
  static reject(err) {
    return new MyPromise((resolve, reject) => {
      reject(err);
    });
  }
  // 第一个成功或失败
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(
          new TypeError(
            "undefined is not iterable (cannot read property Symbol(Symbol.iterator))"
          )
        );
      }
      if(promises.length === 0) {
        return new MyPromise()
      }
      // 等待第一个敲定
      promises.forEach((p) => {
        MyPromise.resolve(p).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }
  // 全部成功或者有一个失败
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(
          new TypeError(
            "undefined is not iterable (cannot read property Symbol(Symbol.iterator))"
          )
        );
      }
      if(promises.length === 0) {
        return resolve([])
      }
      const result = [];
      let count = 0;
      // 等待第一个敲定
      promises.forEach((p, index) => {
        MyPromise.resolve(p).then(
          (res) => {
            result[index] = res;
            count++;
            if(count === promises.length) {
              resolve(result)
            }
          },
          (err) => {
            reject(err);
          }
        );
      });
    
    });
  }
  // 全部敲定不管成功还是失败
  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(
          new TypeError(
            "undefined is not iterable (cannot read property Symbol(Symbol.iterator))"
          )
        );
      }
      if(promises.length === 0) {
        return resolve([])
      }
      const result = [];
      let count = 0;
      // 等待第一个敲定
      promises.forEach((p, index) => {
        MyPromise.resolve(p).then(
          (res) => {
            result[index] = {
              status: FULFILLED,
              value: res
            };
            count++;
            if(count === promises.length) {
              resolve(result)
            }
          },
          (err) => {
            result[index] = {
              status: REJECTED,
              reason: err
            };
            count++;
            if(count === promises.length) {
              resolve(result)
            }
          }
        );
      });
    });
  }
  // 任意一个敲定
  static any(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(
          new TypeError(
            "undefined is not iterable (cannot read property Symbol(Symbol.iterator))"
          )
        );
      }
      if(promises.length === 0) {
        return reject(new AggregateError([], 'All promises were rejected'))
      }
      const errors = [];
      let count = 0;
      // 等待第一个敲定
      promises.forEach((p, index) => {
        MyPromise.resolve(p).then(
          (res) => {
            resolve(res)
          },
          (err) => {
            errors[index] = err;
            count++;
            if(count === promises.length) {
              reject(new AggregateError(errors, 'All promises were rejected'))
            }
          }
        );
      });
    });
  }
}

function runAsyncTask(callback) {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(callback);
  } else if (typeof MutationObserver === "function") {
    const ob = new MutationObserver(callback);
    const textNode = document.createTextNode("");
    ob.observe(el, { characterData: true });
    textNode.data = Math.random();
  } else {
    setTimeout(callback, 0);
  }
}
// 
function resolvePromise(p2, x, resolve, reject) {
  // 处理重复引用
  if (x === p2) {
    throw new TypeError("Chaining cycle detected for promise #<Promise>");
  }
  // 处理链式调用then中返回Promise的情况
  if (x instanceof MyPromise) {
    x.then(
      (res) => {
        resolve(res);
      },
      (err) => {
        reject(err);
      }
    );
  } else {
    resolve(x);
  }
}
/** 测试代码 1 */
// const p = new MyPromise((resolve, reject) => {
//     // resolve('success')
//     reject('error')
// })
// p.then((res) => {
//     console.log('成功回调1: '+ res)
// }, (err) => {
//     console.log('失败回调1: ' + err)
// })

/** 测试代码 2 */
// const p = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(1)
//     }, 0)
// })
// p.then((res) => {
//     console.log('成功回调1: '+ res)
// }, (err) => {
//     console.log('失败回调1: ' + err)
// })
/** 测试代码 3 异步任务 */
// console.log('start')
// const p = new MyPromise((resolve, reject) => {
//     // resolve('success')
//     reject('error')
// })
// p.then((res) => {
//     console.log('成功回调1: '+ res)
// }, (err) => {
//     console.log('失败回调1: ' + err)
// })

// console.log('end')
/** 测试代码 4 链式编程 处理then中的返回值 */
// const p = new MyPromise((resolve, reject) => {
//   resolve(1)
//   // reject('error')
// })
// p.then(res => {
//   // throw 'error'
//   return 2
// }).then(res => {
//   console.log('success回调2：' + res)
// }, err => {
//   console.log('error回调2：' + err)
// })

/** 测试代码5 链式编程  处理then中返回promise实例 */

// const p = new MyPromise((resolve, reject) => {
//   resolve(1)
//   // reject('error')
// })
// p.then(res => {
//   console.log('success回调1：' + res)
//   return new MyPromise((resolve, reject) => {
//     resolve(2)
//   })
// }).then(res => {
//   console.log('success回调2：' + res)
// }, err => {
//   console.log('error回调2：' + err)
// })

/** 测试代码 6 链式编程 处理重复引用错误 */
// const p = new MyPromise((resolve, reject) => {
//   resolve(1)
//   // reject('error')
// })
// const p2 = p.then(res => {
//   return p2
// })

// p2.then(
//   res => {},
//   err => { console.log(err) }
// )

/** 测试代码 7 链式编程 pending状态 */

// const p = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1)
//   }, 2000)
// })
// const p2 = p.then(res => {
//   console.log(res)
//   throw 'error'
// })

// p2.then(
//   res => { console.log(res) },
//   err => { console.log(err) }
// )

/** 测试代码 8 实例方法 catch => Promise.prototype.then(undefined, onRejected) */
// const p = new MyPromise((resolve, reject) => {
//   // reject('buxixi')
//   throw 'xixi'
// })
// p.then(res => {
//   console.log('success' + res)
// }).catch(err => {
//   console.log('catch' + err)
// })

/** 测试代码 9 实例方法 finally => Promise.prototype.then(onFinally, onFinally)*/
// const p = new MyPromise((resolve, reject) => {
//   // resolve('xixi')
//   // reject('buxixi')
//   throw 'buxixi'
// })
// p.then(res => {
//   console.log('success:' + res)
// }).catch(err => {
//   console.log('catch:' + err)
// }).finally(() => {
//   console.log('finally')
// })

/** 测试代码 10 静态方法 Promise.resolve & Promise.reject */
// MyPromise.resolve(new MyPromise((resolve, reject) => {
//   resolve('xixi')
//   // reject('buxixi')
//   // throw 'buxixi'
// })).then(res => {
//   console.log('success:' + res)
// }, err => {
//   console.log('catch:' + err)
// })

// MyPromise.resolve('hahaha').then(res => {
//   console.log(res)
// })

// MyPromise.reject('error').catch(res => {
//   console.log(res)
// })

/** 测试代码 11 静态方法 Promise.race */
// const p1 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1);
//   }, 2000);
// });
// const p2 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     reject(2);
//   }, 1000);
// });
// MyPromise.race([p1, p2, "itheima"]).then((res) => {
//   console.log("res:", res)
// }, err => {
//   console.log("err:", err)
// });

/** 测试代码 12 静态方法 Promise.all */

// const p1 = MyPromise.resolve(1);
// const p2 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     // resolve(2);
//     reject('error')
//   }, 1000);
// });
// const p3 = 3;
// MyPromise.all([p1, p2, p3]).then(
//   (res) => {
//     console.log("res:", res);
//   },
//   (err) => {
//     console.log("err:", err);
//   }
// );


/** 测试代码 13 静态方法 Promise.allSettled */
// const p1 = MyPromise.resolve(1);
// const p2 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     // resolve(2);
//     reject('error')
//   }, 1000);
// });
// const p3 = 3;
// MyPromise.allSettled([p1, p2, p3]).then(
//   (res) => {
//     console.log("res:", res);
//   },
//   (err) => {
//     console.log("err:", err);
//   }
// );

/** 测试代码 14 静态方法 Promise.any */
// const p1 = MyPromise.reject(1);
// const p2 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     // resolve(2);
//     reject(2)
//   }, 1000);
// });
// const p3 = MyPromise.reject(3);
// MyPromise.any([p1, p2, p3]).then(
//   (res) => {
//     console.log("res:", res);
//   },
//   (err) => {
//     console.log("err:", err);
//   }
// );

module.exports = {
  deferred() {   // 使用 promises-aplus-tests 测试代码
    const res = {}
    res.promise = new MyPromise((resolve, reject) => {
      res.resolve = resolve
      res.reject = reject
    })
    return res
  }
}