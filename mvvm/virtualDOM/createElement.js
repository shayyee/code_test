import el from './element.js'
var ul = el(
    'ul', 
    {id: 'list'}, 
    [
        el('li', {class: 'item'}, ['Item 1']),
        el('li', {class: 'item'}, ['Item 2']),
        el('li', {class: 'item'}, ['Item 3'])
    ]
)

var element_ul = ul.render()
console.log(element_ul)
document.body.appendChild(element_ul)