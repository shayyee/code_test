/**
 * promise用法
 * const promise = new Promise(function (resolve, reject) {
 *   setTimeout(() => {
 *     resolve('success');
 *   }, 1000);
 * });
 * promise.then((value) => {
 *  console.log(value);
 * });
 */

class MyPromise {
    constructor(fn) {
        let _resolve = (val) => {

        }
        let _reject = (val) => {

        }
        try {
            fn(_resolve, _reject);
        } catch(e) {
            console.log(e)
        }
    }
}