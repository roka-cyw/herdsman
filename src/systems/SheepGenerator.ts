import Sheep from '../entities/Sheep'

export default class SheepGenerator {
  private static readonly MIN_SPAWN_DELAY = 2000
  private static readonly MAX_SPAWN_DELAY = 10000 // Number.MAX_SAFE_INTEGER
  private static readonly MIN_SHEEP_COUNT = 2
  private static readonly MAX_SHEEP_COUNT = 10

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

    this.spawnTimeoutId = setTimeout(() => {
      this.spawnSheep()
      this.scheduleNextSpawn() // Recursive call
    }, delay)
  }

  private spawnSheep(): void {
    const sheepCount = this.getRandomSheepCount()

    for (let i = 0; i < sheepCount; i++) {
      const x = Math.random() * this.screenWidth
      const y = Math.random() * this.screenHeight

      const sheep = new Sheep(x, y)
      this.onSheepSpawned(sheep) // Callback to the MainScene
    }

    console.log(`Spawned ${sheepCount} sheep`)
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
