import * as PIXI from 'pixi.js'

import Herdsman from '../entities/Herdsman'

import { GRASS_COLOR } from '../utils/constants'

export default class MainScene {
  private app: PIXI.Application
  private container: PIXI.Container

  private herdsman!: Herdsman
  private gameField!: PIXI.Graphics

  constructor(app: PIXI.Application) {
    this.app = app
    this.container = new PIXI.Container()
  }

  public init(): void {
    this.app.stage.addChild(this.container)
    this.createGameField()

    this.herdsman = new Herdsman(this.app.screen.width * 0.85, this.app.screen.height * 0.85)
    this.container.addChild(this.herdsman.getDisplayObject())

    this.setupClickHandler(this.herdsman)
  }

  private createGameField(): void {
    this.gameField = new PIXI.Graphics()
    this.gameField.rect(0, 0, this.app.screen.width, this.app.screen.height)
    this.gameField.fill(GRASS_COLOR)
    this.container.addChild(this.gameField)
  }

  private setupClickHandler(herdsman: Herdsman): void {
    this.app.stage.interactive = true
    this.app.stage.on('pointerdown', event => {
      const globalPos = event.global
      herdsman.moveToPosition(globalPos.x, globalPos.y)
    })
  }

  private updateGameField(newWidth: number, newHeight: number): void {
    if (this.gameField) {
      this.gameField.clear() // Destroy old graphic
      this.gameField.rect(0, 0, newWidth, newHeight)
      this.gameField.fill(GRASS_COLOR)
    }
  }

  public onResize(newWidth: number, newHeight: number): void {
    this.updateGameField(newWidth, newHeight)

    // Recalculate herdsman position
    this.herdsman.setPosition(newWidth * 0.85, newHeight * 0.85)
  }

  public destroy(): void {
    this.container.removeFromParent()
    this.container.destroy()
  }
}
