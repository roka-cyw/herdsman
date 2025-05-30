import { GameObject } from './GameObject'

export abstract class StaticObject extends GameObject {
  public update(deltaTime: number): void {}
}
