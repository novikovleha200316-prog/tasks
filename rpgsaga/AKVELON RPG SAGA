import * as readline from "readline";
class Logger {
  private static instance: Logger;
  private logs: string[] = [];
  private constructor() {}
  static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }
  log(message: string): void {
    this.logs.push(message);
    console.log(message);
  }
  logRoundSeparator(round: number): void {
    this.log(`\n${"=".repeat(60)}`);
    this.log(`КОН ${round}.`);
    this.log(`${"=".repeat(60)}`);
  }
  logBattleSeparator(p1: Player, p2: Player): void {
    this.log(`\n${"-".repeat(40)}`);
    this.log(`${p1.getDisplayName()} vs ${p2.getDisplayName()}`);
    this.log(`${"-".repeat(40)}`);
  }
  clear(): void { this.logs = []; }
}
abstract class Player {
  protected _name: string;
  protected _health: number;
  protected _strength: number;
  protected _isAlive: boolean;
  protected _type: string;
  constructor(name: string, health: number, strength: number, type: string) {
    this._name = name;
    this._health = health;
    this._strength = strength;
    this._isAlive = true;
    this._type = type;
  }
  get name(): string { return this._name; }
  get health(): number { return this._health; }
  get strength(): number { return this._strength; }
  get isAlive(): boolean { return this._isAlive; }
  get type(): string { return this._type; }
  set health(value: number) {
    this._health = Math.max(0, value);
    if (this._health <= 0) this._isAlive = false;
  }
  normalAttack(): number { return this._strength; }
  abstract useAbility(target: Player): number;
  takeDamage(damage: number): void {
    if (!this._isAlive) return;
    const actualDamage = Math.min(damage, this._health);
    this.health -= actualDamage;
    Logger.getInstance().log(`${this.getDisplayName()} получает урон ${actualDamage}. Осталось здоровья: ${this._health}`);
    if (!this._isAlive) Logger.getInstance().log(`${this.getDisplayName()} погибает!`);
  }
  getDisplayName(): string { return `(${this._type}) ${this._name}`; }
  reset(): void {}
}
class Knight extends Player {
  constructor(name: string, health: number, strength: number) {
    super(name, health, strength, "Рыцарь");
  }
  useAbility(target: Player): number {
    const totalDamage = this._strength + Math.floor(this._strength * 0.3);
    Logger.getInstance().log(`${this.getDisplayName()} использует "Удар возмездия" и наносит урон ${totalDamage} противнику ${target.getDisplayName()}`);
    target.takeDamage(totalDamage);
    return totalDamage;
  }
}
class Archer extends Player {
  private _hasUsedAbility = false;
  private _isBurning = false;
  private _burnTarget: Player | null = null;

  constructor(name: string, health: number, strength: number) {
    super(name, health, strength, "Лучник");
  }
  useAbility(target: Player): number {
    if (this._hasUsedAbility) {
      return this.normalAttackWithBurn(target);
    }
    this._hasUsedAbility = true;
    this._isBurning = true;
    this._burnTarget = target;
    Logger.getInstance().log(`${this.getDisplayName()} использует "Огненные стрелы"! ${target.getDisplayName()} загорается и будет терять по 2 здоровья каждый ход.`);
    return 0;
  }
  private normalAttackWithBurn(target: Player): number {
    const damage = this._strength;
    Logger.getInstance().log(`${this.getDisplayName()} наносит урон ${damage} противнику ${target.getDisplayName()}`);
    target.takeDamage(damage);
    if (this._isBurning && this._burnTarget === target && target.isAlive) {
      Logger.getInstance().log(`${target.getDisplayName()} получает 2 урона от горения!`);
      target.takeDamage(2);
    }
    return damage;
  }
  reset(): void {
    this._hasUsedAbility = false;
    this._isBurning = false;
    this._burnTarget = null;
  }
}
class Mage extends Player {
  private _isCharmed = false;

  constructor(name: string, health: number, strength: number) {
    super(name, health, strength, "Маг");
  }
  useAbility(target: Player): number {
    Logger.getInstance().log(`${this.getDisplayName()} использует "Заворожение" на ${target.getDisplayName()}!`);
    if (target instanceof Mage) (target as Mage).setCharmed(true);
    return 0;
  }
  setCharmed(value: boolean): void {
    this._isCharmed = value;
    if (value) Logger.getInstance().log(`${this.getDisplayName()} заворожен и пропустит ход!`);
  }
  isCharmed(): boolean { return this._isCharmed; }
  clearCharmed(): void { this._isCharmed = false; }
  reset(): void { this._isCharmed = false; }
}
class Game {
  private players: Player[] = [];
  private readonly NAMES = ["Эльдар", "Артур", "Гэндальф", "Вильямс", "Леголас", "Арагорн", "Гимли", "Фродо", "Саруман", "Боромир", "Галадриэль", "Эовин"];

  constructor(playerCount: number) {
    if (playerCount % 2 !== 0) throw new Error("Количество игроков должно быть чётным!");
    this.initPlayers(playerCount);
  }
  private random(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

  private initPlayers(count: number): void {
    for (let i = 0; i < count; i++) {
      const name = this.NAMES[Math.floor(Math.random() * this.NAMES.length)];
      const health = this.random(50, 200);
      const strength = this.random(10, 50);
      const type = this.random(1, 3);
      let p: Player;
      if (type === 1) p = new Knight(name, health, strength);
      else if (type === 2) p = new Archer(name, health, strength);
      else p = new Mage(name, health, strength);
      this.players.push(p);
      Logger.getInstance().log(`Создан игрок: ${p.getDisplayName()} (❤️ ${health}, ⚔️ ${strength})`);
    }
  }
  private battle(p1: Player, p2: Player): Player {
    Logger.getInstance().logBattleSeparator(p1, p2);
    p1.reset(); p2.reset();
    let turn = 0;
    while (p1.isAlive && p2.isAlive) {
      turn++;
      Logger.getInstance().log(`ХОД ${turn}:`);
      if (this.turn(p1, p2)) if (!p2.isAlive) break;
      if (p2.isAlive && p1.isAlive) if (this.turn(p2, p1)) if (!p1.isAlive) break;
    }
    const winner = p1.isAlive ? p1 : p2;
    Logger.getInstance().log(`Победитель боя: ${winner.getDisplayName()}!\n`);
    return winner;
  }
  private turn(attacker: Player, defender: Player): boolean {
    if (attacker instanceof Mage && (attacker as Mage).isCharmed()) {
      Logger.getInstance().log(`${attacker.getDisplayName()} заворожен и пропускает ход!`);
      (attacker as Mage).clearCharmed();
      return false;
    }
    const useAbility = Math.random() < 0.5;
    if (useAbility) {
      attacker.useAbility(defender);
    } else {
      const dmg = attacker.normalAttack();
      Logger.getInstance().log(`${attacker.getDisplayName()} наносит урон ${dmg} противнику ${defender.getDisplayName()}`);
      defender.takeDamage(dmg);
    }
    return !defender.isAlive;
  }
  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  startTournament(): Player {
    let current = [...this.players];
    let round = 1;
    while (current.length > 1) {
      Logger.getInstance().logRoundSeparator(round);
      const winners: Player[] = [];
      current = this.shuffle(current);
      for (let i = 0; i < current.length; i += 2) {
        if (i + 1 < current.length) winners.push(this.battle(current[i], current[i + 1]));
      }
      current = winners;
      round++;
    }
    const champ = current[0];
    Logger.getInstance().log(`\n🏆 ЧЕМПИОН ТУРНИРА: ${champ.getDisplayName()}! 🏆`);
    return champ;
  }
}

async function main(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("AKVELON RPG SAGA");
  console.log("=".repeat(60));
  console.log("\n1. Запустить турнир");
  console.log("2. Запустить Unit тесты");
  console.log("3. Выйти");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q: string) => new Promise<string>(r => rl.question(q, r));
  const choice = await ask("\nВыберите (1-3): ");
  if (choice === "3") { console.log("До свидания!"); rl.close(); return; }
  if (choice === "2") {
    console.log("\n" + "=".repeat(60) + "\nЗАПУСК ТЕСТОВ\n" + "=".repeat(60));
    let p = 0, f = 0;
    const k = new Knight("Тест", 100, 25);
    if (k.name === "Тест" && k.health === 100) { console.log("✓ Рыцарь"); p++; } else f++;
    const a = new Archer("Тест", 80, 30);
    if (a.name === "Тест") { console.log("✓ Лучник"); p++; } else f++;
    const m = new Mage("Тест", 90, 15);
    if (m.name === "Тест") { console.log("✓ Маг"); p++; } else f++;
    try { new Game(3); console.log("✗ Ошибка при нечётном"); f++; } catch { console.log("✓ Нечётное"); p++; }
    console.log(`\nРезультаты: ${p} пройдено, ${f} не пройдено`);
    rl.close(); return;
  }
  const cnt = parseInt(await ask("\nВведите количество игроков (чётное, 2-20): "));
  if (isNaN(cnt) || cnt % 2 !== 0 || cnt < 2) { console.log("❌ Ошибка!"); rl.close(); return; }
  console.log(`\n🎮 Турнир с ${cnt} игроками...\n`);
  Logger.getInstance().clear();
  const game = new Game(cnt);
  const champ = game.startTournament();
  console.log(`\n🏆 ПОБЕДИТЕЛЬ: ${champ.getDisplayName()}! 🏆`);
  rl.close();
}
main();
