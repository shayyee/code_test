#! /usr/bin/env node
/**
 * 实现一个TaskPro 类，支持添加异步任务，异步任务按添加顺序执行
 * const t = new TaskPro();
 * t.addTask(async (next) => {
 *     console.log(1, 'start');
 *     await next();
 *     console.log(1, 'end');
 * });
 * t.addTask(() => {
 *     console.log(2);
 * });
 * t.addTask(() => {
 *     console.log(3);
 * });
 * t.run();  // 1 start, 2, 3, 1 end
 */
class TaskPro {
    constructor() {
        this._init();
        this._next = async () => {
            this._currentIndex++;
            await this._runTask();
        }
    }
    _init() {
        this._taskList = [];
        this._isRunning = false;
        this._currentIndex = 0;
    }
    addTask(task) {
        this._taskList.push(task)
    }
    run() {
        if(this._isRunning || !this._taskList.length) return;
        this._isRunning = true;
        this._runTask();
    }
    async _runTask() {
        if(this._currentIndex >= this._taskList.length) { // 任务队列为空
            this._init();
            return;
        }
        const cur = this._currentIndex;
        const task = this._taskList[this._currentIndex];
        await task(this._next);
        if(cur === this._currentIndex) {  // 没有手动调用next的话自动调用执行下个任务
            await this._next();
        }
    }
}

const t = new TaskPro();
t.addTask(async (next) => {
    console.log(1, 'start');
    await next();
    console.log(1, 'end');
});
t.addTask(() => {
    console.log(2)
});
t.addTask(() => {
    console.log(3);
});
t.run();  // 1 start, 2, 3, 1 end

