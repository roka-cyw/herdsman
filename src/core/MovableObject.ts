import { GameObject } from './GameObject'

export abstract class MovableObject extends GameObject {
  protected speed: number = 100
}
