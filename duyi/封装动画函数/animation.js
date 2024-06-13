function animation(duration, from, to, callback) {
  const distance = to - from;
  const speed = distance / duration;
  const startTime = Date.now();
  let value = from; // 当前值
  callback(value);
  function _step() {
    console.log(111)
    const currentTime = Date.now();
    // 已经经过的时间
    const elapsedTime = currentTime - startTime;
    if(elapsedTime >= duration) {
        value = to;
        callback(value);
        return;
    }
    value = from + speed * elapsedTime;
    callback(value);
    requestAnimationFrame(_step);
  }
  requestAnimationFrame(_step);
}
// 可以用steps指定改变的次数
function animation2(duration, from, to, steps, callback) {
    const distance = to - from;
    const speed = distance / steps;
    const startTime = Date.now();
    let value = from; // 当前值
    let stepCount = 0; // 添加这里
    callback(value);
    function _step() {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      if(elapsedTime >= duration) {
          value = to;
          callback(value);
          return;
      }
      // 检查是否已经到达下一步的时间
      if (elapsedTime >= stepCount * duration / steps) {
          value = from + speed * stepCount;
          callback(value);
          stepCount++;
      }
      requestAnimationFrame(_step);
    }
    requestAnimationFrame(_step);
  }