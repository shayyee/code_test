/**
 * 模拟requestIdleCallback
 * @type {function(): number}
 */
const genId = (function () {
  let id = 0
  return function () {
    return ++id
  }
})()

const idMap = {}

export const _requestIdleCallback = function (cb, options) {
  const channel = new MessageChannel()
  const port1 = channel.port1
  const port2 = channel.port2
  let deadlineTime // 超时时间
  let frameDeadlineTime // 当前帧的截止时间
  let callback

  const id = genId()

  port2.onmessage = () => {
    const frameTimeRemaining = () => frameDeadlineTime - performance.now() // 获取当前帧剩余时间
    const didTimeout = performance.now() >= deadlineTime // 是否超时

    if (didTimeout || frameTimeRemaining() > 0) {
      const idleDeadline = {
        timeRemaining: frameTimeRemaining,
        didTimeout,
      }
      callback && callback(idleDeadline)
    } else {
      idMap[id] = requestAnimationFrame((timeStamp) => {
        frameDeadlineTime = timeStamp + 16.7
        port1.postMessage(null)
      })
    }
  }

  idMap[id] = window.requestAnimationFrame((timeStamp) => {
    frameDeadlineTime = timeStamp + 16.7 // 当前帧截止时间，按照 60fps 计算
    deadlineTime = options?.timeout ? timeStamp + options.timeout : Infinity // 超时时间
    callback = cb
    port1.postMessage(null)
  })

  return id
}

export const _cancelIdleCallback = function (id) {
  if (!idMap[id]) return
  window.cancelAnimationFrame(idMap[id])
  delete idMap[id]
}
