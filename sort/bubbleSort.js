// 冒泡排序
function bubbleSort(arr) {
  let len = arr.length;
  for(let i = 0; i < len - 1; i++) {
    for(let j = 0; j < len - i - 1; j++) {
      if(arr[j] > arr[j + 1]) {
        [arr[j+1],arr[j]] = [arr[j], arr[j+1]]
      }
    }
  }
  return arr
}
console.log(bubbleSort([3,2,1,5,4,1]))