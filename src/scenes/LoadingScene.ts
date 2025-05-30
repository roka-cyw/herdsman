import * as PIXI from 'pixi.js'

export default class LoadingScene {
  private app: PIXI.Application
  private container: PIXI.Container
  private onComplete: () => void

  constructor(app: PIXI.Application, onComplete: () => void) {
    this.app = app
    this.container = new PIXI.Container()
    this.onComplete = onComplete
  }

  public init(): void {
    this.app.stage.addChild(this.container)
    this.createBackground()
    this.createStartButton()
  }

  private createBackground(): void {
    const bg = new PIXI.Graphics()
    bg.rect(0, 0, this.app.screen.width, this.app.screen.height)
    bg.fill(0xff0000)
    this.container.addChild(bg)
  }

  private createStartButton(): void {
    const buttonContainer = new PIXI.Container()

    const button = new PIXI.Graphics()
    button.rect(-100, -50, 200, 100)
    button.fill(0xffffff)

    const buttonText = new PIXI.Text({
      text: 'START GAME',
      style: {
        fontSize: 24,
        fontWeight: 'bold',
        fill: 0x000000,
        fontFamily: 'Arial'
      }
    })

    buttonText.anchor.set(0.5)

    buttonContainer.x = this.app.screen.width / 2
    buttonContainer.y = this.app.screen.height / 2

    buttonContainer.interactive = true
    buttonContainer.cursor = 'pointer'
    buttonContainer.on('pointerdown', () => {
      this.onComplete()
    })

    buttonContainer.addChild(button)
    buttonContainer.addChild(buttonText)

    this.container.addChild(buttonContainer)
  }

  public destroy(): void {
    this.container.removeFromParent()
    this.container.destroy()
  }
}
