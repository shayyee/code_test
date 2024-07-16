// 创建一个支持取消的自定义Promise包装器

class CancellablePromise {
  constructor(executor) {
    this._hasCanceled = false;

    this._promise = new Promise((resolve, reject) => {
      executor(
        (value) =>
          this._hasCanceled ? reject({ canceled: true }) : resolve(value),
        (reason) =>
          this._hasCanceled ? reject({ canceled: true }) : reject(reason)
      );
    });
  }

  cancel() {
    this._hasCanceled = true;
  }

  then(onFulfilled, onRejected) {
    return this._promise.then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this._promise.catch(onRejected);
  }
}

// 使用自定义的CancellablePromise
const cancellablePromise = new CancellablePromise((resolve, reject) => {
  setTimeout(() => resolve("Completed!"), 1000);
});

cancellablePromise.then(
  (result) => console.log(result),
  (err) => {
    if (err.canceled) {
      console.log("Promise was canceled");
    } else {
      console.error("Promise error:", err);
    }
  }
);

// 取消Promise
cancellablePromise.cancel();
