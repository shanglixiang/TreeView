{
  const treeData = []
  const maxDepth = 18
  const maxHLen = 12
  let count = 0

  for (let depth = 0; depth < maxDepth; depth++) {
    const upStair = treeData[depth - 1]
    let len = Math.pow(2, depth)

    len = len > maxHLen ? maxHLen : len
    treeData[depth] = []

    for (let i = 0; i < len; i++) {
      ++count
      treeData[depth].push({
        id: count,
        pid: upStair ? upStair[rand(0, upStair.length - 1)].id : 0,
      })
    }
  }

  window.treeData = treeData.flat()
}

// console.log(JSON.stringify(treeData))
// treeData = [{"id":42,"pid":21},{"id":55,"pid":42},{"id":90,"pid":55},{"id":104,"pid":90},{"id":122,"pid":104},{"id":135,"pid":122},{"id":169,"pid":135},{"id":188,"pid":169},{"id":190,"pid":169},{"id":204,"pid":190},{"id":226,"pid":204},{"id":246,"pid":226},{"id":257,"pid":246},{"id":264,"pid":246},{"id":276,"pid":264},{"id":286,"pid":264},{"id":304,"pid":286},{"id":309,"pid":286},{"id":321,"pid":309},{"id":206,"pid":190},{"id":150,"pid":122},{"id":163,"pid":150},{"id":187,"pid":163},{"id":198,"pid":187},{"id":131,"pid":104},{"id":143,"pid":131},{"id":156,"pid":143},{"id":173,"pid":156},{"id":185,"pid":156},{"id":193,"pid":185},{"id":59,"pid":42},{"id":91,"pid":59},{"id":105,"pid":91},{"id":119,"pid":105},{"id":64,"pid":42},{"id":78,"pid":64},{"id":97,"pid":78},{"id":129,"pid":97},{"id":138,"pid":129},{"id":155,"pid":138},{"id":181,"pid":155},{"id":157,"pid":138},{"id":176,"pid":157},{"id":177,"pid":157},{"id":210,"pid":177},{"id":224,"pid":210},{"id":231,"pid":210},{"id":234,"pid":231},{"id":259,"pid":234},{"id":283,"pid":259},{"id":301,"pid":283},{"id":326,"pid":301},{"id":329,"pid":301},{"id":302,"pid":283},{"id":316,"pid":302},{"id":270,"pid":234},{"id":281,"pid":270},{"id":248,"pid":231},{"id":256,"pid":248},{"id":287,"pid":256},{"id":307,"pid":287},{"id":313,"pid":307},{"id":318,"pid":307},{"id":319,"pid":307},{"id":147,"pid":129},{"id":102,"pid":78},{"id":68,"pid":42},{"id":77,"pid":68}]