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
const namedSpawners = new Map<string, SpawnerFunction>();

function registerSpawner(spawner: SpawnerFunction, times: number) {
	if (spawner.name && (spawner.name !== "")) {
		namedSpawners.set(spawner.name.toLowerCase(), spawner);
	}
	if (times == 1) {
		emoteSpawners.push(spawner);
	} else if (times > 1) {
		const oldLength = emoteSpawners.length;
		emoteSpawners.length = oldLength + times;
		emoteSpawners.fill(spawner, oldLength);
	}
}

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

export function spawnNamed(name: string, emoteIds: string[]): boolean {
	const spawner = namedSpawners.get(name.toLowerCase());
	if (spawner) {
		spawner(emoteIds);
		return true;
	}
	return false;
}

registerSpawner(spawnBuster, 2);
registerSpawner(spawnFloat, 15);
registerSpawner(spawnGonne, 10);
registerSpawner(spawnMoon, 3);
registerSpawner(spawnPeek, 15);
registerSpawner(spawnRandom, 0);
registerSpawner(spawnRandomGrouped, 0);
registerSpawner(spawnRandomSingle, 0);
registerSpawner(spawnSpook, 3);
registerSpawner(spawnSpring, 4);
registerSpawner(spawnTrain, 0);
registerSpawner(spawnTumble, 15);

/**
 * Train carts in waiting for the next train, see trainCartLottery().
 */
let trainCarts: string[] = [];

export function scheduleTrain(delay: number = 0) {
	setTimeout((carts: string[]) => {
		spawnTrain(carts);
	}, delay, trainCarts);
	trainCarts = [];
}

export function appendTrain(...emoteIds: string[]) {
	trainCarts.push(...emoteIds);
}

/*
 * Roll the wheel for a chance to add one of the the given emotes to the pending train card list!
 * @param emoteIds Twitch emote IDs.
 */
export function trainCartLottery(emoteIds: string[]) {
	if (Math.random() < config.trainChance) {
		appendTrain(emoteIds[Math.floor(randomTo(emoteIds.length))]);
		if (trainCarts.length >= config.trainLength) {
			scheduleTrain(randomIn(config.trainDelay / 5, config.trainDelay));
		}
	}
}
