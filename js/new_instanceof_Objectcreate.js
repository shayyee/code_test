// 手写new
function myNew() {
    const obj = new Object()
    const Constructor = [].shift.call(arguments)
    obj.__proto__ = Constructor.prototype
    const ret = Constructor.apply(obj, arguments)
    return typeof ret === 'object' ? ret : obj
}
// 测试
function Person(name, age) {
    this.name = name
    this.age = age
}
const person = myNew(Person, 'kevin', 18)
console.log(person) // Person { name: 'kevin', age: 18 }
// 手写instanceof
function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left)
    const prototype = right.prototype
    while (true) {
        if (proto === null) return false
        if (proto === prototype) return true
        proto = Object.getPrototypeOf(proto)
    }
}
// 测试
console.log(myInstanceof([], Array)) // true
// 手写Object.create
function create(obj) {
    function F() {}
    F.prototype = obj
    return new F()
}
// 测试
const obj = { a: 1 }
const obj1 = create(obj)
console.log(obj1.a) // 1
// 手写Object.assign
function myAssign(target, ...source) {
    if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object')
    }
    const result = Object(target)
    source.forEach(obj => {
        if (obj != null) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    result[key] = obj[key]
                }
            }
        }
    })
    return result
}
// 测试
const target = { a: 1 }
const source = { b: 2 }
const source1 = { c: 3 }
const result = myAssign(target, source, source1)
console.log(result) // { a: 1, b: 2, c: 3 }