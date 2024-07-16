// 手写Object.keys
function myKeys(obj) {
    if (typeof obj !== 'object') {
        throw new TypeError('obj is not object')
    }
    const result = []
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result.push(key)
        }
    }
    return result
}
// 测试
const obj = { a: 1, b: 2 }
console.log(myKeys(obj)) // [ 'a', 'b' ]
// 手写Object.values
function myValues(obj) {
    if (typeof obj !== 'object') {
        throw new TypeError('obj is not object')
    }
    const result = []
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result.push(obj[key])
        }
    }
    return result
}
// 测试
const obj = { a: 1, b: 2 }
console.log(myValues(obj)) // [ 1, 2 ]
// 手写Object.entries
function myEntries(obj) {
    if (typeof obj !== 'object') {
        throw new TypeError('obj is not object')
    }
    const result = []
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result.push([key, obj[key]])
        }
    }
    return result
}
// 测试
const obj = { a: 1, b: 2 }
console.log(myEntries(obj)) // [ [ 'a', 1 ], [ 'b', 2 ] ]
