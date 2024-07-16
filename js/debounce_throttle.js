function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, ...args);
        }, delay)
    }
} 

function throttle(fn, delay) {
    let timer;
    return function(...args) {
        if(timer) return
        timer = setTimeout(() => {
            fn.call(this, ...args);
            clearTimeout(timer)
            timer = null;
        }, delay)
    }
}

// 模拟throttle场景
function handle() {
    console.log(Math.random())
}
const throttleHandle = throttle(handle, 1000);
window.addEventListener('mousemove', throttleHandle);
