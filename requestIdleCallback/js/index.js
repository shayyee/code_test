const dMap = new DMap()

const normalRenderBtn = document.querySelector('.normal-render')
const ridRenderBtn = document.querySelector('.rid-render')

normalRenderBtn.addEventListener('click', () => {
  dMap.addMarkers(1)
})

ridRenderBtn.addEventListener('click', () => {
  dMap.addMarkers(2)
})
