/**
 * 手写call
 * 1. 在Function原型对象上定义myCall
 * 2. 设置调用原函数时的 this 指向： 先把方法赋值给 context.fn，然后执行 thisArg.fn 时使用的 this 就会指向 thisArg
 * 3. 接收剩余参数并返回执行结果
 * 4. 使用 Symbol 调优，避免 context 中原有的 fn 属性被覆盖
 */
Function.prototype.myCall = function (context, ...args) {
    if(typeof this !==  'function') {
        throw new TypeError('not a function');
    }
    context = context || window;
    const symbol = Symbol('fn');
    context[symbol] = this;
    const res = context[symbol](...args);
    delete context[symbol];
    console.log(context)
    return res;
}

/**
 * 手写apply
 */
Function.prototype.myApply = function (context, args) {
  if(typeof this !== 'function') {
    throw new TypeError('not a function')
  }
  context = context || window;
  const symbol = Symbol('fn');
  context[symbol] = this;
  let result;
  if(args) {
    result = context[symbol](...args);
  } else{
    result = context[symbol]();
  }
  delete context[symbol];
  return result;
};
/**
 * 手写bind
 * 1. 在Function原型对象上定义myBind
 * 2. 返回一个绑定 this 的新函数
 * 3. 合并绑定和调用时的参数
 */
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("not a function");
  }
//   const _this = this;
//   const args = [...arguments].slice(1);
//   return function F() {
//     if (this instanceof F) {
//       return new _this(...args, ...arguments);
//     }
//     return _this.apply(context, args.concat(...arguments));
//   };
// 返回一个箭头函数，this指向就是包裹箭头函数的普通函数的this，即 [原函数].myBind 时的原函数
    return (...reArgs) => {
        return this.call(context, ...args, ...reArgs);
    }
};
// 测试
const obj = {
  value: 11,
};
function getValue(name, age) {
  console.log(name);
  console.log(age);
  console.log(this.value);
  return name + age + this.value;
}
// getValue.myCall(obj, "kevin", 18); // kevin 18 1
// getValue.myApply(obj, ["kevin", 18]); // kevin 18 1
const getValue1 = getValue.myBind(obj, "kevin");
const res = getValue1(18); // kevin 18 1
console.log(res)
