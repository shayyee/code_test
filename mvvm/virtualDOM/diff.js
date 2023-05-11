function diff() {

}

/**
 * 对树进行深度优先遍历
 * @param {*} oldNode 
 * @param {*} newNode 
 * @param {*} index 
 * @param {*} patches 
 */
function dfsWalk (oldNode, newNode, index, patches) {

}

// // [1,13]  2  => 10
// function findKthNumber(n, k) {
//     let curr = 1;  // 当前数字
//     let num = k-1;  // 从当前数字往后找num个
//     while(num > 0) {
//         let steps = getSteps(curr, n);
//     }
// }
// // 当前数字子树一共有多少个符合小于等于 n 的数字
// function getSteps(curr, n) {
//     let steps = 0;
//     let left = right = curr
    
// }

var findKthNumber = function(n, k) {
    let curr = 1;
    k--;
    while (k > 0) {
        const steps = getSteps(curr, n);
        if (steps <= k) {
            k -= steps;
            curr++;
        } else {
            curr = curr * 10;
            k--;
        }
    }
    return curr;
}

var getSteps = (curr, n) => {
    let steps = 0;
    let first = curr;
    let last = curr;
    while (first <= n) {
        steps += Math.min(last, n) - first + 1;
        first = first * 10;
        last = last * 10 + 9;
    }
    return steps;
};

console.log(findKthNumber(10, 3))