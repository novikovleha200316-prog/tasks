import { describe, it, expect, vi, beforeEach } from "vitest";
import { Logger } from "./logger";
import { Knight } from "./knight";
import { Archer } from "./archer";
import { Mage } from "./mage";
import { Game } from "./game";
describe("Рыцарь (Knight)", () => {
  it("должен создаваться с правильными параметрами", () => {
    const knight = new Knight("Артур", 100, 25);
    expect(knight.name).toBe("Артур");
    expect(knight.health).toBe(100);
    expect(knight.strength).toBe(25);
    expect(knight.type).toBe("Рыцарь");
    expect(knight.isAlive).toBe(true);
  });
  it("способность 'Удар возмездия' должна наносить +30% урона", () => {
    const knight = new Knight("Артур", 100, 20);
    const target = new Knight("Цель", 100, 10);
    const initialHealth = target.health;
    const damage = knight.useAbility(target);
    const expectedDamage = 20 + Math.floor(20 * 0.3);
    expect(damage).toBe(expectedDamage);
    expect(target.health).toBe(initialHealth - expectedDamage);
  });
  it("обычная атака должна наносить урон равный силе", () => {
    const knight = new Knight("Артур", 100, 25);
    const target = new Knight("Цель", 100, 10);
    const initialHealth = target.health;
    const damage = knight.normalAttack();
    expect(damage).toBe(25);
    target.takeDamage(damage);
    expect(target.health).toBe(initialHealth - 25);
  });
  it("должен умирать при получении урона больше здоровья", () => {
    const knight = new Knight("Артур", 50, 20);
    knight.takeDamage(60);
    expect(knight.health).toBe(0);
    expect(knight.isAlive).toBe(false);
  });
});
describe("Лучник (Archer)", () => {
  it("должен создаваться с правильными параметрами", () => {
    const archer = new Archer("Леголас", 80, 30);
    expect(archer.name).toBe("Леголас");
    expect(archer.health).toBe(80);
    expect(archer.strength).toBe(30);
    expect(archer.type).toBe("Лучник");
  });
  it("способность 'Огненные стрелы' не наносит урон при первом использовании", () => {
    const archer = new Archer("Леголас", 80, 30);
    const target = new Knight("Цель", 100, 10);
    const initialHealth = target.health;
    const damage = archer.useAbility(target);
    expect(damage).toBe(0);
    expect(target.health).toBe(initialHealth);
  });
  it("способность 'Огненные стрелы' можно использовать только 1 раз за бой", () => {
    const archer = new Archer("Леголас", 80, 30);
    const target = new Knight("Цель", 100, 10);
    archer.useAbility(target);
    const secondDamage = archer.useAbility(target);
    expect(secondDamage).toBe(30);
  });
  it("после сброса способность снова доступна", () => {
    const archer = new Archer("Леголас", 80, 30);
    const target = new Knight("Цель", 100, 10);
    archer.useAbility(target);
    archer.reset();
    const damage = archer.useAbility(target);
    expect(damage).toBe(0);
  });
  it("эффект горения наносит 2 урона каждый ход после использования способности", () => {
    const archer = new Archer("Леголас", 80, 30);
    const target = new Knight("Цель", 100, 10);
    archer.useAbility(target);
    const initialHealth = target.health;
    archer.normalAttack();
    expect(target.health).toBe(initialHealth - 30 - 2);
  });
});
describe("Маг (Mage)", () => {
  it("должен создаваться с правильными параметрами", () => {
    const mage = new Mage("Гэндальф", 90, 15);
    expect(mage.name).toBe("Гэндальф");
    expect(mage.health).toBe(90);
    expect(mage.strength).toBe(15);
    expect(mage.type).toBe("Маг");
  });
  it("способность 'Заворожение' не наносит урон", () => {
    const mage = new Mage("Гэндальф", 90, 15);
    const target = new Knight("Цель", 100, 10);
    const damage = mage.useAbility(target);
    expect(damage).toBe(0);
  });
  it("способность 'Заворожение' завораживает цель", () => {
    const mage = new Mage("Гэндальф", 90, 15);
    const target = new Mage("Цель", 100, 10);
    mage.useAbility(target);
    expect(target.isCharmed()).toBe(true);
  });
  it("завороженный маг пропускает ход", () => {
    const mage = new Mage("Гэндальф", 90, 15);
    mage.setCharmed(true);
    expect(mage.isCharmed()).toBe(true);
  });
  it("после сброса чары снимаются", () => {
    const mage = new Mage("Гэндальф", 90, 15);
    mage.setCharmed(true);
    mage.reset();
    expect(mage.isCharmed()).toBe(false);
  });
});
describe("Базовый класс Player", () => {
  it("игрок не должен получать урон после смерти", () => {
    class TestPlayer extends Player {
      useAbility(target: Player): number { return 0; }
    }
    const player = new TestPlayer("Тест", 50, 10, "Тест");
    player.takeDamage(100);
    const healthAfterDeath = player.health;
    player.takeDamage(10);
    expect(player.health).toBe(healthAfterDeath);
  });
  it("getDisplayName должен возвращать корректный формат", () => {
    const knight = new Knight("Артур", 100, 20);
    expect(knight.getDisplayName()).toBe("(Рыцарь) Артур");
  });
});
describe("Игра (Game)", () => {
  it("должна выбрасывать ошибку при нечётном количестве игроков", () => {
    expect(() => new Game(3)).toThrow("Количество игроков должно быть чётным!");
  });
  it("должна создавать правильное количество игроков", () => {
    const game = new Game(4);
    expect(game["players"].length).toBe(4);
  });
  it("все игроки должны иметь здоровье в диапазоне 50-200", () => {
    const game = new Game(6);
    for (const player of game["players"]) {
      expect(player.health).toBeGreaterThanOrEqual(50);
      expect(player.health).toBeLessThanOrEqual(200);
    }
  });
  it("все игроки должны иметь силу в диапазоне 10-50", () => {
    const game = new Game(6);
    for (const player of game["players"]) {
      expect(player.strength).toBeGreaterThanOrEqual(10);
      expect(player.strength).toBeLessThanOrEqual(50);
    }
  });
  it("должен быть только один победитель", () => {
    const game = new Game(4);
    const champion = game.startTournament();
    expect(champion.isAlive).toBe(true);
  });
});
describe("Logger", () => {
  let logger: Logger;
  beforeEach(() => {
    logger = Logger.getInstance();
    logger.clear();
  });
  it("должен быть синглтоном", () => {
    const logger1 = Logger.getInstance();
    const logger2 = Logger.getInstance();
    expect(logger1).toBe(logger2);
  });
  it("должен сохранять сообщения", () => {
    logger.log("Тестовое сообщение");
    expect(logger.getLogs().length).toBe(1);
    expect(logger.getLogs()[0]).toContain("Тестовое сообщение");
  });
  it("разделитель раунда должен содержать номер раунда", () => {
    logger.logRoundSeparator(5);
    const logs = logger.getLogs();
    expect(logs.some(log => log.includes("КОН 5."))).toBe(true);
  });
});
