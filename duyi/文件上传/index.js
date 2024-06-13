const container = document.getElementById('container');
var fileList = [];
container.ondragenter = function (e) {
    e.preventDefault();
}
container.ondragover = function (e) {
    e.preventDefault();
}
container.ondrop = function (e) {
    e.preventDefault();
    for (let item of e.dataTransfer.items) {
        const entry = item.webkitGetAsEntry();
        getFile(entry);
    }
}
function getFile(entry) {
    if(entry.isFile) {
        entry.file((file) => {
            fileList.push(file);
        })
    } else {
        const reader = entry.createReader();
        reader.readEntries((entries) => {
            entries.forEach(e => {
                getFile(e)
            })
        })
    }
}
