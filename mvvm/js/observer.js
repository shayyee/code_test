class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep();
    }
}

// function observe(data) {
//     if (!data || typeof data !== "object") {
//         return;
//     }

//     Object.keys(data).forEach(function (key) {
//         defineReactive(data, key, data[key]);
//     });
// }

// function defineReactive(data, key, val) {
//     var dep = new Dep();
//     observe(val);
//     Object.defineProperty(data, key, {
//         enumerable: true,
//         configurable: false,
//         get: function () {
//             // 通过Dep定义一个全局target属性，暂存watcher, 添加完移除
//             if(Dep.target) {
//                 dep.depend();
//             }
//             return val;
//         },
//         set: function (newVal) {
//             if (val !== newVal) {
//                 val = newVal;
//                 dep.notify();
//             }
//         },
//     });
// }

// var uid = 0;
// Dep.target = null; // 通过Dep定义一个全局target属性，暂存watcher
// function Dep() {
//     this.id = uid++;
//     this.subs = [];   // 依赖列表
// }

// Dep.prototype = {
//     depend: function() {
//         Dep.target.addDep(this);
//     },
//     addSub: function(sub) {  // 增加依赖
//         this.subs.push(sub)
//     },
//     removeSub: function(sub) {// 移除依赖
//         var index = this.subs.indexOf(sub);
//         if (index != -1) {
//             this.subs.splice(index, 1);
//         }
//     },
//     notify: function() {  // 通知依赖
//         this.subs.forEach(function(sub) {
//             sub.update();
//         })
//     }
// }


// var obj = {
//     name: "ssss",
// };
// observe(obj);
// obj.name = "dddff";
// console.log(obj.name);
