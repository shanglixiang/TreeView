function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function sleep(time) {
  return new Promise((next) => {
    time ? setTimeout(next, time) : next()
  })
}

Array.prototype.first = function() {
  return this[0]
}

Array.prototype.last = function() {
  return this[this.length - 1]
}

Array.prototype.swap = function(a, b) {
  const t = this[a]
  this[a] = this[b]
  this[b] = t
}

Array.prototype.shuffle = function() {
  for (let i = 0; i < this.length; i++) {
    this.swap(i, Math.floor(Math.random() * (i + 1)))
  }
  return this
}

Array.prototype.min = function() {
  return Math.min(...this)
}

Array.prototype.max = function() {
  return Math.max(...this)
}

