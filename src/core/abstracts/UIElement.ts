import * as PIXI from 'pixi.js'

export abstract class UIElement {
  protected container: PIXI.Container
  protected x: number
  protected y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.container = new PIXI.Container()
    this.container.name = this.constructor.name
    // Sync coordinates
    this.updatePosition()
    this.createContent()
  }

  protected abstract createContent(): void

  protected updatePosition(): void {
    this.container.x = this.x
    this.container.y = this.y
  }

  public resize(screenWidth: number, screenHeight: number): void {
    this.onResize(screenWidth, screenHeight)
  }

  protected onResize(screenWidth: number, screenHeight: number): void {}

  protected setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
    this.updatePosition()
  }

  public getContainer(): PIXI.Container {
    return this.container
  }

  public destroy(): void {
    this.container.removeFromParent()
    this.container.destroy()
  }
}
