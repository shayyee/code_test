function Vue(options) {
    this._init(options);
}

Vue.prototype._init = function (options) {
    const vm = this;
    vm._isVue = true;
    vm.$options = {
        ...options
    }
    vm._data = vm.$options.data;
    initData(vm);
    initMethods(vm);
    vm.$options.el = document.querySelector(vm.$options.el)
    vm.$mount(vm.$options.el)
}

function initData (vm) {
    let data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};
    
}

function initMethods (vm) {
    let methods = vm.$options.methods;
    if (methods) {
        for (let key in methods) {
            vm[key] = methods[key].bind(vm);
        }
    }
}