import { config } from "../config";
import { randomIn, randomTo } from "../util/random";
import { spawnBuster } from "./buster";
import { spawnFloat } from "./float";
import { spawnGonne } from "./gonne";
import { spawnMoon } from "./moon";
import { spawnPeek } from "./peek";
import { spawnSpook } from "./spook";
import { spawnSpring } from "./spring";
import { spawnTrain } from "./train";
import { spawnTumble } from "./tumble";

export type SpawnerFunction = (emoteIds: string[]) => void;
const emoteSpawners: Array<SpawnerFunction> = [];

function registerSpawner(spawner: SpawnerFunction, times: number) {
	if (times == 1) {
		emoteSpawners.push(spawner);
	} else if (times > 1) {
		const oldLength = emoteSpawners.length;
		emoteSpawners.length = oldLength + times;
		emoteSpawners.fill(spawner, oldLength);
	}
}

registerSpawner(spawnBuster, 5);
registerSpawner(spawnFloat, 15);
registerSpawner(spawnGonne, 10);
registerSpawner(spawnMoon, 5);
registerSpawner(spawnPeek, 15);
registerSpawner(spawnSpook, 10);
registerSpawner(spawnSpring, 5);
registerSpawner(spawnTumble, 15);

function randomSpawner(): SpawnerFunction {
	return emoteSpawners[Math.floor(randomTo(emoteSpawners.length))];
}

export function spawnRandomGrouped(emoteIds: string[]) {
	randomSpawner()(emoteIds);
}

export function spawnRandomSingle(emoteIds: string[]) {
	emoteIds.forEach((emoteId, index) => {
		setTimeout(() => {
			randomSpawner()([emoteId]);
		}, index * 500 + randomTo(500));
	});
}

export function spawnRandom(emoteIds: string[]) {
	if (Math.random() < config.groupChance) {
		spawnRandomGrouped(emoteIds);
	} else {
		spawnRandomSingle(emoteIds);
	}
	trainCartLottery(emoteIds);
}

/**
 * Train carts in waiting for the next train, see trainCartLottery().
 */
let trainCarts: string[] = [];

/*
 * Roll the wheel for a chance to add one of the the given emotes to the pending train card list!
 * @param emoteIds Twitch emote IDs.
 */
export function trainCartLottery(emoteIds: string[]) {
	if (Math.random() < config.trainChance) {
		trainCarts.push(emoteIds[Math.floor(randomTo(emoteIds.length))]);
		if (trainCarts.length >= config.trainLength) {
			setTimeout((carts: string[]) => {
				spawnTrain(carts);
			}, randomIn(config.trainDelay / 5, config.trainDelay), trainCarts);
			trainCarts = [];
		}
	}
}
