import * as PIXI from 'pixi.js'

import { Scene } from '../core/Scene'
import Herdsman from '../entities/Herdsman'

export default class MainScene extends Scene {
  private static readonly GRASS_COLOR = 0x4caf50

  private herdsman!: Herdsman

  constructor(app: PIXI.Application) {
    super(app)
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
    this.gameField.fill(MainScene.GRASS_COLOR)
    this.container.addChild(this.gameField)
  }

  private setupClickHandler(herdsman: Herdsman): void {
    this.app.stage.interactive = true
    this.app.stage.on('pointerdown', event => {
      const globalPos = event.global
      herdsman.moveToPosition(globalPos.x, globalPos.y)
    })
  }

  protected updateGameField(newWidth: number, newHeight: number): void {
    if (this.gameField) {
      this.gameField.clear() // Destroy old graphic
      this.gameField.rect(0, 0, newWidth, newHeight)
      this.gameField.fill(MainScene.GRASS_COLOR)
    }
  }

  public onResize(newWidth: number, newHeight: number): void {
    this.updateGameField(newWidth, newHeight)

    // Recalculate objects positions on the scene
    this.herdsman.setPosition(newWidth * 0.85, newHeight * 0.85)
  }
}
