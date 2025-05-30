import * as PIXI from 'pixi.js'

async function init() {
  await new Promise(resolve => setTimeout(resolve, 100))

  const container = document.getElementById('game')!

  const app = new PIXI.Application()
  await app.init({
    width: Math.floor(container.clientWidth),
    height: Math.floor(container.clientHeight),
    backgroundColor: 0x4caf50
  })

  container.appendChild(app.canvas as HTMLCanvasElement)

  // Resize handler
  window.addEventListener('resize', () => {
    setTimeout(() => {
      app.renderer.resize(container.clientWidth, container.clientHeight)
    }, 50)
  })

  // Debuger
  ;(globalThis as any).__PIXI_APP__ = app
}

init()
