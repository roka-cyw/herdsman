import * as PIXI from 'pixi.js'

import { MovableObject } from '../core/MovableObject'

export default class Sheep extends MovableObject {
  private static readonly SHEEP_COLOR = 0xffffff
  private static readonly SHEEP_RADIUS = 14
  private static readonly SHEEP_SPEED = 700

  constructor(x: number, y: number) {
    super(x, y)
    this.speed = Sheep.SHEEP_SPEED
  }

  protected createDisplayObject(): PIXI.Container {
    const container = new PIXI.Container()

    const sheepCircle = new PIXI.Graphics()
    sheepCircle.circle(0, 0, Sheep.SHEEP_RADIUS)
    sheepCircle.fill(Sheep.SHEEP_COLOR)

    container.addChild(sheepCircle)
    return container
  }

  public update(deltaTime: number): void {
    this.moveToTarget(deltaTime)
  }

  public moveToPosition(x: number, y: number): void {
    this.setTarget(x, y)
  }
}
