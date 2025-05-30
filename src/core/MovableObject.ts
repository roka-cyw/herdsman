import { GameObject } from './GameObject'

export abstract class MovableObject extends GameObject {
  protected targetX?: number
  protected targetY?: number
  protected speed: number = 100

  public setTarget(x: number, y: number): void {
    this.targetX = x
    this.targetY = y
  }

  protected moveToTarget(deltaTime: number): void {
    if (this.targetX !== undefined && this.targetY !== undefined) {
      const dx = this.targetX - this.x
      const dy = this.targetY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > 5) {
        this.x += (dx / distance) * this.speed * deltaTime
        this.y += (dy / distance) * this.speed * deltaTime
        this.updatePosition()
      }
    }
  }
}
