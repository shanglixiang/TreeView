class TreeView {
  constructor(d = {}) {
    const me = this

    me.d = d

    d.conf = {
      lineHeight: 40,
      itemHeight: 20,
      translateX: Number(localStorage.translateX) || 0,
      translateY: Number(localStorage.translateY) || 0,
    }
    d.gd = d.canvas.getContext('2d')

    me.initData()
    me.setLayout()
    me.initEvents()
  }
  initData() {
    const me = this
    const d = me.d
    const {gd} = d
    
    gd.font = '14px Arial'
    d.stair = []
    d.mapId = {}
    d.mapPid = {}

    d.data.forEach((node) => {
      node.width = Math.ceil(gd.measureText(node.id).width + 15)
      d.mapId[node.id] = node
      d.mapPid[node.pid] = d.mapPid[node.pid] || []
      d.mapPid[node.pid].push(node)
    })

    d.root = d.data[0]

    while (d.mapId[d.root?.pid]) {
      d.root = d.mapId[d.root.pid]
    }

    const setDepth = (node, depth) => {
      node.depth = depth
      !d.stair[depth] && (d.stair[depth] = [])
      node.hIndex = d.stair[depth].length
      d.stair[depth].push(node)

      me.getChildren(node).forEach((v) => {
        setDepth(v, depth + 1)
      })
    }
    setDepth(d.root, 0)
  }
  initEvents() {
    const me = this
    const d = me.d
    const {canvas} = d

    window.onresize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      me.render()
    }
    window.onresize()

    canvas.onclick = (e) => {
      me.render(e)
    }

    document.onmousedown = (e) => {
      const {clientX: x1, clientY: y1} = e
      const originX = d.conf.translateX
      const originY = d.conf.translateY

      document.onmousemove = (e) => {
        const {clientX: x2, clientY: y2} = e

        d.conf.translateX = x2 - x1 + originX
        d.conf.translateY = y2 - y1 + originY

        me.render()
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null

        localStorage.translateX = d.conf.translateX
        localStorage.translateY = d.conf.translateY
        me.render()
      }
    }
  }
  getChildren(node) {
    return this.d.mapPid[node.id] || []
  }
  getPrev(node) {
    return this.d.stair[node.depth][node.hIndex - 1]
  }
  getNext(node) {
    return this.d.stair[node.depth][node.hIndex + 1]
  }
  getAllprogeny(node) {
    const me = this
    const result = []
    const getProgeny = (node) => {
      result.push(node)
      me.getChildren(node).forEach(getProgeny)
    }
    getProgeny(node)
    return result
  }
  translate(node, x = 0, y = 0) {
    const me = this
    const translate = (node) => {
      node.x += x
      node.y += y
      me.getChildren(node).forEach(translate)
    }
    translate(node)
  }
  getDis(node) {
    const me = this
    const arr = me.getAllprogeny(node).filter((v) => {
      const nodePrev = me.getPrev(v)
      return nodePrev && !me.contains(node, nodePrev)
    }).map((v) => {
      const nodePrev = me.getPrev(v)
      return v.x - nodePrev.x - nodePrev.width
    })
    return arr.length > 0 ? arr.min() : 0
  }
  getDis2(node) {
    const me = this
    const arr = me.getAllprogeny(node).filter((v) => {
      const nodeNext = me.getNext(v)
      return nodeNext && !me.contains(node, nodeNext)
    }).map((v) => {
      const nodeNext = me.getNext(v)
      return nodeNext.x - v.x - v.width
    })
    return arr.length > 0 ? arr.min() : 0
  }
  contains(a, b) {
    while (b) {
      if (a === b) return true
      b = this.d.mapId[b.pid]
    }
    return false
  }
  setLayout() {
    const me = this
    const d = me.d

    for (let depth = d.stair.length - 1; depth > -1; depth--) {
      const row = d.stair[depth]

      for (let i = 0; i < row.length; i++) {
        const node = row[i]
        const children = me.getChildren(node)
        const nodePrev = me.getPrev(node)

        node.y = depth * d.conf.lineHeight

        if (children.length > 0) {
          for (let j = children.length - 2; j > -1; j--) {
            const _node = children[j]
            const dis = me.getDis2(_node)
            dis && me.translate(_node, dis)
          }

          node.x = (children[0].x + children.last().x + children.last().width) / 2 - node.width / 2
          const dis = me.getDis(node)
          dis && me.translate(node, -dis)
        } else {
          node.x = nodePrev ? nodePrev.x + nodePrev.width : 0
        }
      }
    }
  }
  render(e) {
    const me = this
    const d = me.d
    const {canvas, gd} = d

    const renderLine = () => {
      gd.beginPath()
      d.stair.forEach((row) => {
        row.forEach((node) => {
          const nodeP = d.mapId[node.pid]
          if (!nodeP) return

          const x1 = nodeP.x + nodeP.width / 2
          const y1 = nodeP.y + d.conf.itemHeight / 2

          const x4 = node.x + node.width / 2
          const y4 = node.y + d.conf.itemHeight / 2

          const x2 = x1
          const y2 = (y1 + y4) / 2

          const x3 = x4
          const y3 = (y1 + y4) / 2

          gd.moveTo(x1, y1)
          gd.bezierCurveTo(
            x2, y2,
            x3, y3,
            x4, y4,
          )
        })
      })
      gd.strokeStyle = '#999'
      gd.stroke()
    }

    const renderNode = () => {
      gd.font = '14px Arial'
      gd.textAlign = 'center'
      gd.textBaseline = 'middle'

      d.stair.forEach((row) => {
        row.forEach((node) => {
          gd.beginPath()
          gd.rect(node.x + 1, node.y, node.width - 2, d.conf.itemHeight)
          gd.fillStyle = node.fillStyle || 'rgba(0,170,255,.7)'
          gd.fill()

          if (e && gd.isPointInPath(e.offsetX, e.offsetY)) {
            console.log(JSON.stringify(me.getAllprogeny(node).map((v) => {
              return {
                id: v.id,
                pid: v.pid,
              }
            })))
          }

          gd.fillStyle = '#fff'
          gd.fillText(node.id, node.x + node.width / 2, node.y + d.conf.itemHeight / 2)
        })
      })
    }

    gd.fillStyle = 'white'
    gd.fillRect(0, 0, canvas.width, canvas.height)

    gd.save()
    gd.translate(d.conf.translateX, d.conf.translateY)
    renderLine()
    renderNode()
    gd.restore()
  }
}