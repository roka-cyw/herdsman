import * as PIXI from 'pixi.js'

import { MovableObject } from '../core/abstracts/MovableObject'
import Herdsman from './Herdsman'

export default class Sheep extends MovableObject {
  private static readonly SHEEP_COLOR = 0xffffff
  private static readonly SHEEP_RADIUS = 14
  private static readonly SHEEP_SPEED = 700

  private isFollowing: boolean = false
  private sheepCircle!: PIXI.Graphics
  private herdsman?: Herdsman

  constructor(x: number, y: number) {
    super(x, y)
    this.speed = Sheep.SHEEP_SPEED
  }

  protected createDisplayObject(): PIXI.Container {
    const container = new PIXI.Container()

    this.sheepCircle = new PIXI.Graphics()
    this.sheepCircle.circle(0, 0, Sheep.SHEEP_RADIUS)
    this.sheepCircle.fill(Sheep.SHEEP_COLOR)

    container.addChild(this.sheepCircle)
    return container
  }

  public update(deltaTime: number): void {
    if (this.isFollowing && this.herdsman) {
      const herdsmanPos = this.herdsman.getPosition()
      // TODO: Add randomizer for the sheep distance
      this.setTarget(herdsmanPos.x + 20, herdsmanPos.y + 20)
    }

    this.moveToTarget(deltaTime)
  }

  public moveToPosition(x: number, y: number): void {
    this.setTarget(x, y)
  }

  public setFollowing(following: boolean): void {
    this.isFollowing = following
    // TODO: Add some offset to x and y. The main point of it its create a random print of the following sheep
  }

  public getIsFollowing(): boolean {
    return this.isFollowing
  }

  public setHerdsman(herdsman: Herdsman): void {
    this.herdsman = herdsman
  }
}
