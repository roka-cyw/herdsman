import Sheep from '../entities/Sheep'

export default class SheepGenerator {
  private static readonly MIN_SPAWN_DELAY = 2000
  private static readonly MAX_SPAWN_DELAY = 10000 // Number.MAX_SAFE_INTEGER
  private static readonly MIN_SHEEP_COUNT = 2
  private static readonly MAX_SHEEP_COUNT = 10
  private static readonly CHANCE_TO_PATROL = 0.3 // 30% of chance
  private static readonly YARD_OFFSET_X = 350
  private static readonly YARD_OFFSET_Y = 50

  private isActive: boolean = false
  private screenWidth: number
  private screenHeight: number
  private onSheepSpawned: (sheep: Sheep) => void
  private spawnTimeoutId: number | null = null

  constructor(screenWidth: number, screenHeight: number, onSheepSpawned: (sheep: Sheep) => void) {
    this.screenWidth = screenWidth
    this.screenHeight = screenHeight
    this.onSheepSpawned = onSheepSpawned
  }

  private clearTimeout(): void {
    if (this.spawnTimeoutId !== null) {
      clearTimeout(this.spawnTimeoutId)
      this.spawnTimeoutId = null
    }
  }

  private scheduleNextSpawn(): void {
    if (!this.isActive) return

    const delay = this.getRandomDelay()

    // TODO: Random sheep can overlap the yard
    this.spawnTimeoutId = setTimeout(() => {
      this.spawnSheep()
      this.scheduleNextSpawn() // Recursive call
    }, delay)
  }

  private spawnSheep(): void {
    const count = this.getRandomSheepCount()

    for (let i = 0; i < count; i++) {
      const x = SheepGenerator.YARD_OFFSET_X + Math.random() * (this.screenWidth - SheepGenerator.YARD_OFFSET_X)
      const y = SheepGenerator.YARD_OFFSET_Y + Math.random() * (this.screenHeight - SheepGenerator.YARD_OFFSET_Y * 2)

      const sheep = new Sheep(x, y, this.screenWidth, this.screenHeight, this.chanceToPatrol())

      this.onSheepSpawned(sheep)
    }
  }

  private chanceToPatrol(): boolean {
    return Math.random() < SheepGenerator.CHANCE_TO_PATROL
  }

  private getRandomDelay(): number {
    return (
      Math.floor(Math.random() * (SheepGenerator.MAX_SPAWN_DELAY - SheepGenerator.MIN_SPAWN_DELAY + 1)) +
      SheepGenerator.MIN_SPAWN_DELAY
    )
  }

  private getRandomSheepCount(): number {
    return (
      Math.floor(Math.random() * (SheepGenerator.MAX_SHEEP_COUNT - SheepGenerator.MIN_SHEEP_COUNT + 1)) +
      SheepGenerator.MIN_SHEEP_COUNT
    )
  }

  public start(): void {
    this.isActive = true
    this.scheduleNextSpawn()
  }

  public stop(): void {
    this.isActive = false
    this.clearTimeout()
  }
}
