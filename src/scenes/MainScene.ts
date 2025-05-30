import * as PIXI from 'pixi.js'

import { Scene } from '../core/Scene'
import Herdsman from '../entities/Herdsman'

export default class MainScene extends Scene {
  private static readonly GRASS_COLOR = 0x4caf50

  private herdsman!: Herdsman
  private clickHandler?: (event: PIXI.FederatedPointerEvent) => void

  constructor(app: PIXI.Application) {
    super(app)
  }

  public init(): void {
    this.app.stage.addChild(this.container)
    this.createGameField()

    this.herdsman = new Herdsman(this.app.screen.width * 0.85, this.app.screen.height * 0.85)
    this.container.addChild(this.herdsman.getDisplayObject())
    this.setupClickHandler(this.herdsman)

    this.startGameLoop()
  }

  private createGameField(): void {
    this.gameField = new PIXI.Graphics()
    this.gameField.rect(0, 0, this.app.screen.width, this.app.screen.height)
    this.gameField.fill(MainScene.GRASS_COLOR)
    this.container.addChild(this.gameField)
  }

  private startGameLoop(): void {
    this.app.ticker.add(ticker => {
      const deltaTime = ticker.deltaTime / 60 // convert to seconds

      this.herdsman.update(deltaTime)
    })
  }

  private setupClickHandler(herdsman: Herdsman): void {
    this.app.stage.interactive = true

    // Save link for deleting if needed
    this.clickHandler = (event: PIXI.FederatedPointerEvent) => {
      const globalPos = event.global
      herdsman.moveToPosition(globalPos.x, globalPos.y)
    }

    this.app.stage.on('pointerdown', this.clickHandler)
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

  public destroy(): void {
    // Delete handler if scene was destroyed
    if (this.clickHandler) {
      this.app.stage.off('pointerdown', this.clickHandler)
      this.clickHandler = undefined
    }

    super.destroy()
  }
}
