import * as PIXI from 'pixi.js'

import { UIElement } from '../../core/abstracts/UIElement'

export default class DisplayScore extends UIElement {
  private static readonly DISPLAY_SCORE = 0xffffff
  private static readonly DISPLAY_SCORE_TOP_OFFSET = 20
  private static readonly DISPLAY_SCORE_WIDTH_WITH_OFFSET = 180

  private scoreText!: PIXI.Text
  private score: number = Number(0)

  protected createContent(): void {
    this.scoreText = new PIXI.Text({
      text: `Score: ${this.score || 0}`,
      style: { fontSize: 32, fill: DisplayScore.DISPLAY_SCORE }
    })

    this.container.addChild(this.scoreText)
  }

  protected onResize(screenWidth: number, screenHeight: number): void {
    const newX = screenWidth - DisplayScore.DISPLAY_SCORE_WIDTH_WITH_OFFSET - DisplayScore.DISPLAY_SCORE_TOP_OFFSET
    const newY = DisplayScore.DISPLAY_SCORE_TOP_OFFSET

    this.setPosition(newX, newY)
  }

  public addPoints(points: number): void {
    this.score += points
    this.container.removeChildren()

    this.createContent()
  }
}
