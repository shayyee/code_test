import { _requestIdleCallback, _cancelIdleCallback } from './rid.js'

export default class DMap {
  cluster // 聚合点实例
  markerList // 点位列表
  map // 地图实例
  points // 点位数据
  mode = 1 // 1-默认模式 2-使用requestIdleCallback优化
  ridId // requestIdleCallback的id 用来取消rid任务

  constructor(mode = 1) {
    this.map = new AMap.Map('map-container', {
      center: [104.937478, 35.439575],
      zoom: 5,
      mapStyle: 'amap://styles/darkblue',
    })
    this.mode = mode
  }

  async getPoints() {
    this.points = (await import('//cdn.huangx.top/static-app/geo-multi-points.js')).points
  }

  async addMarkers(mode) {
    this.clearMarkers()
    this.markerList = []
    await this.getPoints()
    mode ? (this.mode = mode) : null
    if (this.mode === 1) {
      this.addMarkersNormal()
    } else {
      this.addMarkersByRid()
    }
  }

  clearMarkers() {
    if (this.cluster) {
      this.cluster.setMap(null)
    }
  }

  addMarkersNormal() {
    this.markerList = this.points.map((device, index) => {
      device.deviceName = `设备${index}`

      // let start = performance.now()
      // while (start + 0.01 > performance.now()) {
      //   // 模拟耗时操作
      // }
      return this.genMarker(device)
    })

    this.genCluster()
  }

  addMarkersByRid() {
    _cancelIdleCallback(this.ridId)
    const { markerList, points, genMarker, genCluster } = this
    let index = 0
    const ridOption = { timeout: 20 }
    const handler = (idleDeadline) => {
      const { timeRemaining } = idleDeadline
      while (timeRemaining() > 0 && index < points.length) {
        const device = points[index]
        device.deviceName = `设备${index}`

        let start = performance.now()
        // while (start + 0.01 > performance.now()) {
        //   // performance.now()可精确到微秒
        //   // 模拟耗时操作
        // }

        const marker = genMarker(device)

        markerList.push(marker)
        index++
      }
      if (index < points.length) {
        this.ridId = _requestIdleCallback(handler, ridOption)
      } else {
        genCluster()
      }
    }
    this.ridId = _requestIdleCallback(handler, ridOption)
  }

  // 生成点位
  genMarker(device) {
    const innerHTML = `
      <div class="camera"></div>
    `
    const size = [48, 49]
    const markerOffset = new AMap.Pixel(-size[0] / 2, -size[1] / 2)
    const marker = new AMap.Marker({
      position: device.lnglat,
      extData: device,
      size,
    })
    const container = document.createElement('div')
    container.className = 'map-marker'
    container.innerHTML = innerHTML
    marker.setContent(container)
    marker.setOffset(markerOffset)
    marker.selected = false

    return marker
  }

  // 生成聚合点
  genCluster = () => {
    this.cluster = new AMap.MarkerClusterer(this.map, this.markerList, {
      gridSize: 60,
      renderClusterMarker: this._renderClusterMarker, // 自定义聚合点样式
    })
  }

  // 自定义聚合点样式
  _renderClusterMarker(context) {
    const { count, marker } = context
    const container = document.createElement('div')
    container.className = 'map-marker'
    container.innerText = count > 99 ? '99+' : count
    marker.setContent(container)
  }
}
