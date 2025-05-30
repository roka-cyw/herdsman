import * as PIXI from 'pixi.js'

import { Scene } from '../core/Scene'
import Herdsman from '../entities/Herdsman'
import Sheep from '../entities/Sheep'
import Yard from '../entities/Yard'
import DisplayScore from '../systems/ui/DisplayScore'
import { UIElement } from '../core/abstracts/UIElement'

export default class MainScene extends Scene {
  private static readonly GRASS_COLOR = 0x4caf50
  private static readonly SHEEP_OFFSET = 4
  private static readonly DISPLAY_SCORE_TOP_OFFSET = 20
  private static readonly DISPLAY_SCORE_WIDTH_WITH_OFFSET = 180
  private static readonly OVERLAP_YARD_COLLISION_AREA = 100

  private herdsman!: Herdsman
  private sheep: Sheep[] = []
  private followingSheep: Sheep[] = []

  private yard!: Yard
  private displayScore!: DisplayScore
  private uiElements: UIElement[] = []

  private clickHandler?: (event: PIXI.FederatedPointerEvent) => void
  private gameLoopFn?: (ticker: PIXI.Ticker) => void

  constructor(app: PIXI.Application) {
    super(app)
  }

  public init(): void {
    this.app.stage.addChild(this.container)
    this.createGameField()

    // Create Game Objects
    this.createHerdsman()
    this.createSheeps()
    this.createYard()

    // Create UI Elements
    this.createDisplayScore()

    this.startGameLoop()
  }

  private startGameLoop(): void {
    this.gameLoopFn = ticker => {
      const deltaTime = ticker.deltaTime / 60 // convert to seconds
      this.herdsman.update(deltaTime)
      this.sheep.forEach(sheep => sheep.update(deltaTime))

      this.checkHerdsmanSheepCollisions()
      this.checkHerdsmanYardCollision()
    }

    this.app.ticker.add(this.gameLoopFn)
  }

  private createGameField(): void {
    this.gameField = new PIXI.Graphics()
    this.gameField.rect(0, 0, this.app.screen.width, this.app.screen.height)
    this.gameField.fill(MainScene.GRASS_COLOR)
    this.container.addChild(this.gameField)
  }

  private createHerdsman(): void {
    this.herdsman = new Herdsman(this.app.screen.width * 0.85, this.app.screen.height * 0.85)
    this.container.addChild(this.herdsman.getDisplayObject())

    this.setupClickHandler(this.herdsman)
  }

  private createSheeps(): void {
    const sheepCount = Math.floor(Math.random() * 9) + 2 // Range 2-10

    for (let i = 0; i < sheepCount; i++) {
      const randomX = Math.random() * this.app.screen.width
      const randomY = Math.random() * this.app.screen.height

      const sheep = new Sheep(randomX, randomY)
      this.sheep.push(sheep)
      this.container.addChild(sheep.getDisplayObject())
    }
  }

  private createYard(): void {
    this.yard = new Yard(MainScene.SHEEP_OFFSET, MainScene.SHEEP_OFFSET)
    this.container.addChild(this.yard.getDisplayObject())
  }

  private createDisplayScore(): void {
    this.displayScore = new DisplayScore(
      this.app.screen.width - MainScene.DISPLAY_SCORE_WIDTH_WITH_OFFSET,
      MainScene.DISPLAY_SCORE_TOP_OFFSET
    )
    this.container.addChild(this.displayScore.getContainer())

    this.uiElements.push(this.displayScore)
  }

  private setupClickHandler(herdsman: Herdsman): void {
    this.app.stage.interactive = true

    this.clickHandler = (event: PIXI.FederatedPointerEvent) => {
      const globalPos = event.global
      herdsman.moveToPosition(globalPos.x, globalPos.y)
    }

    this.app.stage.on('pointerdown', this.clickHandler)
  }

  private checkHerdsmanSheepCollisions(): void {
    this.sheep.forEach(sheep => {
      if (this.herdsman.checkCollision(sheep)) {
        if (!sheep.getIsFollowing() && this.herdsman.canAddFollower()) {
          sheep.setFollowing(true)
          sheep.setHerdsman(this.herdsman)
          this.followingSheep.push(sheep)
          this.herdsman.addFollower()
          console.log('Sheep is now following!')
        } else if (!sheep.getIsFollowing()) {
          console.log('Maximum followers reached! (5/5)')
        }
      }
    })
  }

  private checkHerdsmanYardCollision(): void {
    const yardCollisionArea = this.yard.getWidth() + MainScene.OVERLAP_YARD_COLLISION_AREA

    if (this.herdsman.checkCollision(this.yard, yardCollisionArea)) {
      this.deliverSheepToYard()
    }
  }

  private deliverSheepToYard(): void {
    if (this.followingSheep.length > 0) {
      const sheepIdsToRemove = this.followingSheep.map(sheep => sheep.getId())
      this.sheep = this.sheep.filter(sheep => !sheepIdsToRemove.includes(sheep.getId()))

      this.displayScore.addPoints(this.followingSheep.length * 1)

      this.clearDeliveredSheep()
    }
  }

  private clearDeliveredSheep(): void {
    this.herdsman.removeAllFollowers()

    this.followingSheep.forEach(sheep => {
      sheep.getDisplayObject().destroy()
    })
    this.followingSheep = []
  }

  private recalculateHerdsmanPosition(newWidth: number, newHeight: number): void {
    this.herdsman.setPosition(newWidth * 0.85, newHeight * 0.85)
  }

  private recalculateSheepPositions(newWidth: number, newHeight: number): void {
    this.sheep.forEach(sheep => {
      sheep.setPosition(Math.random() * newWidth, Math.random() * newHeight)
    })
  }

  private recalculateYardPosition(newWidth: number, newHeight: number): void {
    this.yard.setPosition(newWidth - newWidth + MainScene.SHEEP_OFFSET, newHeight - newHeight + MainScene.SHEEP_OFFSET)
  }

  private recalculateUIElements(newWidth: number, newHeight: number): void {
    this.uiElements.forEach(ui => ui.resize(newWidth, newHeight))
  }

  private destroyEntities(): void {
    if (this.herdsman) {
      this.herdsman.getDisplayObject().destroy()
      console.log('Herdsman destroyed')
    }

    if (this.yard) {
      this.yard.getDisplayObject().destroy()
      console.log('Yard destroyed')
    }

    this.sheep.forEach((sheep, index) => {
      sheep.getDisplayObject().destroy()
      console.log(`Sheep ${index} destroyed`)
    })
    this.sheep = []
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
    this.recalculateHerdsmanPosition(newWidth, newHeight)
    this.recalculateSheepPositions(newWidth, newHeight)
    this.recalculateYardPosition(newWidth, newHeight)

    // Recalculate UI elements positions on the scene
    this.recalculateUIElements(newWidth, newHeight)
  }

  public destroy(): void {
    // Delete game loop
    if (this.gameLoopFn) {
      this.app.ticker.remove(this.gameLoopFn)
      this.gameLoopFn = undefined
    }

    // Delete entities
    this.destroyEntities()

    // Delete events
    if (this.clickHandler) {
      this.app.stage.off('pointerdown', this.clickHandler)
      this.clickHandler = undefined
    }

    super.destroy()
  }
}
