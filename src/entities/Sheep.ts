import * as PIXI from 'pixi.js'
import { v4 as uuidv4 } from 'uuid'

import { MovableObject } from '../core/abstracts/MovableObject'
import Herdsman from './Herdsman'

export default class Sheep extends MovableObject {
  private static readonly SHEEP_COLOR = 0xffffff
  private static readonly SHEEP_PATROL_COLOR = 0xff0000
  private static readonly SHEEP_PATROL_BORDER = 3
  private static readonly SHEEP_RADIUS = 14
  private static readonly SHEEP_SPEED = 700
  private static readonly PATROL_SPEED = 50
  private static readonly PATROL_DISTANCE = 350

  private container!: PIXI.Container
  private sheepCircle!: PIXI.Graphics
  private herdsman?: Herdsman

  private id: string
  private isFollowing: boolean = false
  private isPatrolling: boolean = false
  private patrolTargetX?: number
  private patrolTargetY?: number
  private screenWidth: number
  private screenHeight: number

  private patrolTimeoutId: number | null = null
  private isWaitingForNewTarget: boolean = false

  constructor(x: number, y: number, screenWidth: number, screenHeight: number, shouldPatrol: boolean = false) {
    super(x, y)
    this.speed = Sheep.SHEEP_SPEED
    this.id = uuidv4()

    this.screenWidth = screenWidth
    this.screenHeight = screenHeight

    if (shouldPatrol) {
      this.enablePatrol()
    }
  }

  protected createDisplayObject(): PIXI.Container {
    this.container = new PIXI.Container()

    this.sheepCircle = new PIXI.Graphics()
    this.sheepCircle.circle(0, 0, Sheep.SHEEP_RADIUS)
    this.sheepCircle.fill(Sheep.SHEEP_COLOR)

    this.container.addChild(this.sheepCircle)
    return this.container
  }

  private enablePatrol(): void {
    this.isPatrolling = true
    this.speed = Sheep.PATROL_SPEED
    this.updateSheepGraphic()
    this.generateNewPatrolTarget()
  }

  private updateSheepGraphic(): void {
    const graphics = this.getSheepGraphics()

    if (graphics && this.isPatrolling) {
      graphics.stroke({ color: Sheep.SHEEP_PATROL_COLOR, width: Sheep.SHEEP_PATROL_BORDER })
    }
  }

  private generateNewPatrolTarget(): void {
    // Generate a point in the radius from the current position
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * Sheep.PATROL_DISTANCE + 50 // Minimum 50px distance

    let newX = this.x + Math.cos(angle) * distance
    let newY = this.y + Math.sin(angle) * distance

    // Limit the screen boundaries
    newX = Math.max(50, Math.min(this.screenWidth - 50, newX))
    newY = Math.max(50, Math.min(this.screenHeight - 50, newY))

    // Check that the new target is not too close to the current position
    const dx = this.x - newX
    const dy = this.y - newY
    const distanceToNew = Math.sqrt(dx * dx + dy * dy)

    if (distanceToNew < 60) {
      // If too close to the current position - try again
      this.generateNewPatrolTarget()
      return
    }

    this.patrolTargetX = newX
    this.patrolTargetY = newY
    this.moveToPosition(newX, newY)
  }

  private getSheepGraphics(): PIXI.Graphics | null {
    if (!this.displayObject || this.displayObject.children.length === 0) {
      console.warn('Sheep graphics not ready')
      return null
    }

    return this.displayObject.children[0] as PIXI.Graphics
  }

  private startPatrol(): void {
    if (this.patrolTargetX !== undefined && this.patrolTargetY !== undefined) {
      const dx = this.x - this.patrolTargetX
      const dy = this.y - this.patrolTargetY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 20 && !this.isWaitingForNewTarget) {
        this.isWaitingForNewTarget = true

        // Clear current target to stop sheep
        this.patrolTargetX = undefined
        this.patrolTargetY = undefined

        this.clearPatrolTimeout()

        // Set new timer to generate new target
        this.patrolTimeoutId = setTimeout(() => {
          if (this.isPatrolling && !this.isFollowing) {
            this.generateNewPatrolTarget()
          }
          this.isWaitingForNewTarget = false
          this.patrolTimeoutId = null
        }, Math.random() * 2000 + 1000)
      }
    } else if (!this.isWaitingForNewTarget && this.isPatrolling) {
      // If there is no target and we are not waiting for a new one - generate it right now
      this.generateNewPatrolTarget()
    }
  }

  private clearPatrolTimeout(): void {
    if (this.patrolTimeoutId !== null) {
      clearTimeout(this.patrolTimeoutId)
      this.patrolTimeoutId = null
    }
  }

  public update(deltaTime: number): void {
    if (this.isFollowing && this.herdsman) {
      const herdsmanPos = this.herdsman.getPosition()
      // TODO: Add randomizer for the sheep distance
      this.moveToPosition(herdsmanPos.x + 20, herdsmanPos.y + 20)
    } else if (this.isPatrolling) {
      this.startPatrol()
    }

    this.moveToTarget(deltaTime)
  }

  public setFollowing(following: boolean): void {
    // TODO: Add some offset to x and y. The main point of it its create a random print of the following sheep
    this.isFollowing = following

    if (following) {
      // Delete patrol when start following
      this.clearPatrolTimeout()
      this.isWaitingForNewTarget = false
      this.speed = Sheep.SHEEP_SPEED
    } else if (this.isPatrolling) {
      // Return to patrol speed and restart patrol
      this.speed = Sheep.PATROL_SPEED
      // If there is no active target - generate new one
      if (!this.patrolTargetX && !this.patrolTargetY && !this.isWaitingForNewTarget) {
        this.generateNewPatrolTarget()
      }
    }
  }

  public moveToPosition(x: number, y: number): void {
    this.setTarget(x, y)
  }

  public stopPatrol(): void {
    this.isPatrolling = false
    this.isWaitingForNewTarget = false
    this.patrolTargetX = undefined
    this.patrolTargetY = undefined
    this.clearPatrolTimeout()
  }

  public setHerdsman(herdsman: Herdsman): void {
    this.herdsman = herdsman
  }

  public getIsFollowing(): boolean {
    return this.isFollowing
  }

  public getId(): string {
    return this.id
  }
}
