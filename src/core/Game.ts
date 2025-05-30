import * as PIXI from 'pixi.js'

import LoadingScene from '../scenes/LoadingScene'
import MainScene from '../scenes/MainScene'

import { BLACK_WIDNOW } from '../utils/constants'

export default class Game {
  public app: PIXI.Application
  private container: HTMLElement
  private currentScene: LoadingScene | MainScene | null = null

  constructor() {
    this.container = document.getElementById('game')!
    this.app = new PIXI.Application()
  }

  public async init(): Promise<void> {
    await this.app.init({
      width: Math.floor(this.container.clientWidth),
      height: Math.floor(this.container.clientHeight),
      backgroundColor: BLACK_WIDNOW
    })

    this.container.appendChild(this.app.canvas as HTMLCanvasElement)
    this.setupResize()
    this.setupDebugger()

    this.startLoadingScene()
  }

  private startLoadingScene(): void {
    this.currentScene = new LoadingScene(this.app, () => {
      this.switchToMainScene()
    })

    this.currentScene.init()
  }

  private startMainScene(): void {
    this.currentScene = new MainScene(this.app)
    this.currentScene.init()
  }

  private switchToMainScene(): void {
    this.currentScene?.destroy()

    this.startMainScene()
  }

  private setupResize(): void {
    window.addEventListener('resize', () => {
      this.app.renderer.resize(Math.floor(this.container.clientWidth), Math.floor(this.container.clientHeight))
    })
  }

  private setupDebugger(): void {
    ;(globalThis as any).__PIXI_APP__ = this.app
  }
}
