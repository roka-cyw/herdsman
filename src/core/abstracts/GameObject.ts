import * as PIXI from 'pixi.js'

export abstract class GameObject {
  protected x: number
  protected y: number
  protected displayObject: PIXI.Container

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.displayObject = this.createDisplayObject()
    this.displayObject.name = this.constructor.name
    // Sync coordinates
    this.updatePosition()
  }

  protected abstract createDisplayObject(): PIXI.Container
  public abstract update(deltaTime: number): void

  protected updatePosition(): void {
    this.displayObject.x = this.x
    this.displayObject.y = this.y
  }

  public checkCollision(other: GameObject): boolean {
    const thisPos = this.getPosition()
    const otherPos = other.getPosition()

    const dx = thisPos.x - otherPos.x
    const dy = thisPos.y - otherPos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    const collisionRadius = 30
    return distance < collisionRadius
  }

  public setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
    this.updatePosition()
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y }
  }

  public getDisplayObject(): PIXI.Container {
    return this.displayObject
  }
}
