import * as PIXI from 'pixi.js'

import { MovableObject } from '../core/abstracts/MovableObject'

export default class Herdsman extends MovableObject {
  private static readonly HERDSMAN_COLOR = 0xff0000
  private static readonly HERDSMAN_RADIUS = 20
  private static readonly HERDSMAN_SPEED = 800

  private static readonly MAX_FOLLOWERS = 5
  private followerCount: number = 0

  constructor(x: number, y: number) {
    super(x, y)
    this.speed = Herdsman.HERDSMAN_SPEED
  }

  protected createDisplayObject(): PIXI.Container {
    const container = new PIXI.Container()

    const herdsmanCircle = new PIXI.Graphics()
    herdsmanCircle.circle(0, 0, Herdsman.HERDSMAN_RADIUS)
    herdsmanCircle.fill(Herdsman.HERDSMAN_COLOR)

    container.addChild(herdsmanCircle)
    return container
  }

  public update(deltaTime: number): void {
    this.moveToTarget(deltaTime)
  }

  public moveToPosition(x: number, y: number): void {
    this.setTarget(x, y)
  }

  public canAddFollower(): boolean {
    return this.followerCount < Herdsman.MAX_FOLLOWERS
  }

  public addFollower(): void {
    if (this.canAddFollower()) {
      this.followerCount++
      console.log(`Followers: ${this.followerCount}/${Herdsman.MAX_FOLLOWERS}`)
    }
  }

  public removeFollower(): void {
    if (this.followerCount > 0) {
      this.followerCount--
      console.log(`Followers: ${this.followerCount}/${Herdsman.MAX_FOLLOWERS}`)
    }
  }

  public getFollowerCount(): number {
    return this.followerCount
  }
}
