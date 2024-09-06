let uid = 0;

export class Dep {
    // target 是一个 Watcher实例，用来存储当前的watcher，
    // 这样在get的时候就可以把当前的watcher存储到Dep.target上
    static target = null;
    constructor() {
        this.id = uid++;
        this.subs = [];
    }
    addSub(sub) {  // 这里的sub 是 Watcher实例    
        this.subs.push(sub);
    }
    removeSub(sub) {
        if(this.subs.length) {
            const index = this.subs.indexOf(sub);
            if (index > -1) {
                this.subs.splice(index, 1);
            }
        }
    }
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }
    notify() {
        const subs = this.subs.slice();
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    }
}