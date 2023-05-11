// 订阅者
function Watcher() {}

Watcher.prototype = {
    get: function(key) {
        Dep.target = this;
        // this.value = data[key]
    }
}