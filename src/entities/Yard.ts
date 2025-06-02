import * as PIXI from 'pixi.js'

import { StaticObject } from '../core/abstracts/StaticObject'

export default class Yard extends StaticObject {
  private static readonly YARD_COLOR = 0xffd966

  constructor(x: number, y: number) {
    super(x, y)
  }

  protected createDisplayObject(): PIXI.Container {
    const container = new PIXI.Container()

    const yard = new PIXI.Graphics()
    yard.rect(0, 0, 300, 300)
    yard.fill(Yard.YARD_COLOR)

    container.addChild(yard)
    container.zIndex = 2
    return container
  }

  public getWidth(): number {
    return this.displayObject.width
  }

  public getHeight(): number {
    return this.displayObject.height
  }
}
