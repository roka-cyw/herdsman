import * as PIXI from 'pixi.js'

import { UIElement } from '../../core/abstracts/UIElement'

export default class DisplayScore extends UIElement {
  private static readonly DISPLAY_SCORE_TOP_OFFSET = 20
  private static readonly DISPLAY_SCORE_WIDTH_WITH_OFFSET = 180

  private scoreText!: PIXI.Text
  private score: number = 0

  protected createContent(): void {
    this.scoreText = new PIXI.Text({
      text: 'Score: 0',
      style: { fontSize: 32, fill: 0xffffff }
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
    this.scoreText.text = `Score: ${this.score}`
  }
}
