import * as PIXI from 'pixi.js'

import { GRASS_COLOR } from '../utils/constants'

export default class MainScene {
  private app: PIXI.Application
  private container: PIXI.Container

  constructor(app: PIXI.Application) {
    this.app = app
    this.container = new PIXI.Container()
  }

  public init(): void {
    this.app.stage.addChild(this.container)
    this.createGameField()
  }

  private createGameField(): void {
    const gameField = new PIXI.Graphics()
    gameField.rect(0, 0, this.app.screen.width, this.app.screen.height)
    gameField.fill(GRASS_COLOR)
    this.container.addChild(gameField)
  }

  public destroy(): void {
    this.container.removeFromParent()
    this.container.destroy()
  }
}
