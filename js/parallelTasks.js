#! /usr/bin/env node
/**
 * 并发执行任务
 * @param {Function[]} tasks 
 * @param {Number} parallelCount 
 * @returns {Promise}
 */

function parallelTask(tasks, parallelCount = 5) {
    return new Promise((resolve) => {
        let currentTaskIndex = 0;
        let completedTaskCount = 0;
        let totalTaskCount = tasks.length;
        let result = [];
        let _next = () => {
            // task已经取完了
            if(currentTaskIndex >= totalTaskCount) return;
            const task = tasks[currentTaskIndex];
            task().then(res => {
                result.push(res);
            }).finally(() => {
                completedTaskCount++;
                if(completedTaskCount == totalTaskCount) {
                    resolve(result);
                } else {
                    _next();
                }
            })
            currentTaskIndex++;
            // 当前并发数小于并发数限制时且还有任务时，继续启动任务
            if(currentTaskIndex < totalTaskCount && currentTaskIndex < parallelCount) {
                _next();
            }
        }
        _next();
    })
}

function mockTasks(num) {
    return Array.from({ length: num }).map((_, i) => {
        return () => new Promise(resolve => {
            setTimeout(() => {
                resolve(i)
            }, Math.random() * 1000)
        })
    })
}

const tasks = mockTasks(10)
parallelTask(tasks, 3).then((res) => {
    console.log('全部完成', res)
})