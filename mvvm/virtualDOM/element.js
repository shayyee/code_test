function Element(tagName, props, children) {
    this.tagName = tagName
    this.props = props
    this.children = children
}

Element.prototype.render = function () {
    const el = document.createElement(this.tagName)
    const props = this.props

    for (const propName in props) {
        const propValue = props[propName]
        el.setAttribute(propName, propValue)
    }

    const children = this.children || []

    children.forEach(child => {
        let childEl = null;
        if(child instanceof Element) { // 如果子节点也是虚拟DOM，递归构建DOM节点
            childEl = child.render()
        } else {     // 如果字符串，只构建文本节点
            childEl = document.createTextNode(child)
        }
        el.appendChild(childEl)
    })

    return el
}

export default function (tagName, props, children) {
    return new Element(tagName, props, children)
}