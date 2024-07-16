/**
 * 寄生组合式继承（用来实现 es6 class的继承）
 * 1.通过父类构造函数继承属性
 * 2.通过原型链继承方法
 * 3.子类构造函数指向子类
 */
function Person(name) {
    this.name = name;
}
Person.prototype.sayHi = function () {
    console.log(`你好，我是${this.name}`);
};
function Student(name, age) {
    Person.call(this, name);
    this.age = age;
}
const prototype = Object.create(Person.prototype, {
    constructor: {
        value: Student,
        enumerable: false, // 不可枚举
    }
});
Student.prototype = prototype;


/**
 * 原型链继承
 * 1.将父类实例作为子类原型
 * 缺点：
 * 1.无法向父类构造函数传参
 * 2.所有实例共享父类实例属性
 * 3.无法实现多继承
 */
function Person(name) {
    this.name = name;
}
Person.prototype.sayHi = function () {
    console.log(`你好，我是${this.name}`);
};
function Student(name, age) {
    this.age = age;
}
Student.prototype = new Person('小明');


/**
 * 借用构造函数继承
 * 1.通过call或apply改变this指向
 * 优点：
 * 1.可以向父类传递参数
 * 缺点：
 * 1.只能继承父类实例属性和方法，不能继承原型属性和方法
 * 2.方法都在构造函数中定义，无法复用，且每次创建实例都会创建一遍方法
 * 3.无法实现多继承
 */
function Person(name) {
    this.name = name;
    // 在构造函数中定义方法
    this.sayHi = function() {
      console.log(`你好，我是${this.name}`);
    };
}
  
function Student(name, age) {
    Person.call(this, name);
    this.age = age;
}

/**
 * 组合继承
 * 1.通过原型链继承方法
 * 2.通过call继承属性
 * 优点：
 * 1.可以继承实例属性和方法，也可以继承原型属性和方法
 * 2.不存在引用属性共享问题
 * 3.可传参
 * 4.函数可复用
 * 缺点：
 * 1.调用了两次父类构造函数
 * 2.子类原型上有多余的父类属性
 * 3.无法实现多继承
 */
function Person(name) {
    this.name = name;
}
Person.prototype.sayHi = function () {
    console.log(`你好，我是${this.name}`);
};
function Student(name, age) {
    Person.call(this, name);
    this.age = age;
}
Student.prototype = new Person()
Student.prototype.constructor = Student;


const s1 = new Student('小明', 18);
const s2 = new Student('小蓝', 20);
console.log(s1, s2);

/**
 * 原型式继承
 * 1.借助原型可以基于已有对象创建新对象
 * 2.ES5 Object.create实现原型式继承
 * 优点：
 * 1.类似于复制一个对象，但是可以修改新对象的属性
 * 缺点：
 * 1.引用属性共享
 * 2.无法传参
 * 3.无法实现多继承
 */
function createObj(obj) {
    function F() {}
    F.prototype = obj;
    return new F();
}
const person = {
    name: '小明',
    friends: ['小红', '小蓝']
};
const p1 = createObj(person);
const p2 = createObj(person);
