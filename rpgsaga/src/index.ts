import { Game } from "./game";
function main(): void {
  console.log("\n" + "=".repeat(60));
  console.log("ДОБРО ПОЖАЛОВАТЬ В AKVELON RPG SAGA!");
  console.log("=".repeat(60));
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  readline.question("Введите количество игроков (чётное число, 2-20): ", (answer: string) => {
    const playerCount = parseInt(answer);
    if (isNaN(playerCount) || playerCount % 2 !== 0 || playerCount < 2) {
      console.log(" Ошибка: количество игроков должно быть чётным и не менее 2!");
      readline.close();
      return;
    }
    console.log(`\n Создаётся турнир с ${playerCount} игроками...\n`);
    const game = new Game(playerCount);
    const champion = game.startTournament();
    console.log(`\n ПОБЕДИТЕЛЬ ТУРНИРА: ${champion.getDisplayName()}! `);
    readline.close();
  });
}
main();
