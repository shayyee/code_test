var container = document.getElementById('container');
var imgWidth = 200;  // 每张图片固定宽度

// 获取图片数据 这里没有图片就用div代替
function getImages() {
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {  // 模拟图片加载
            var div = document.createElement('div');
            div.style.width = imgWidth + 'px';
            div.style.height = Math.floor(Math.random() * 200 + 100) + 'px';
            div.style.backgroundColor = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
            container.appendChild(div);
            setPosition();
        }, Math.random() * 400);
    }
}
// 计算有几列，以及列之间的间隙
function cal() {
    var containerWidth = container.clientWidth;
    var cols = Math.floor(containerWidth / imgWidth);
    var gap = (containerWidth - cols * imgWidth) / (cols + 1);
    return { cols, gap };
}
// 设置每张图片的位置
function setPosition() {
    const { cols, gap } = cal();
    var nextTop = new Array(cols).fill(0);
    container.childNodes.forEach((child) => {
        var minTop = Math.min.apply(null, nextTop);
        var minIndex = nextTop.indexOf(minTop);
        child.style.left = minIndex * (imgWidth + gap) + gap + 'px';
        child.style.top = minTop + gap + 'px';
        nextTop[minIndex] += child.clientHeight + gap;
    });
    container.style.height = Math.max(...nextTop) + gap + 'px';
}

getImages();

var timer = null;
window.onresize = function () {
    if(timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(setPosition, 300);
}
