/**
 * 并发执行任务
 * @param {Function[]} tasks 
 * @param {Number} parallelCount 
 * @returns {Promise}
 */
function parallelTask(tasks, parallelCount = 5) {
    return new Promise((resolve) => {
        let index = 0
        let count = 0
        const result = []
        const len = tasks.length
        const next = () => {
            if (index >= len) {
                return
            }
            const task = tasks[index]
            task().then((res) => {
                result[index] = res
            }).finally(() => {
                count++
                if (count === len) {
                    resolve(result)
                } else {
                    next()
                }
            })
            index++
            // 当前并发数小于并发数限制时且还有任务时，继续启动任务
            if (index < len && index < parallelCount) {
                next()
            }
        }
        next()
    })
}

function mockTasks(num) {
    return Array.from({ length: num }).map((_, i) => {
        return () => new Promise((resolve) => {
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
