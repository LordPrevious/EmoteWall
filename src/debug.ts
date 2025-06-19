import "./app";
import { spawnFloat } from "./animation/float";
import { spawnGonne } from "./animation/gonne";
import { spawnMoon } from "./animation/moon";
import { spawnPeek } from "./animation/peek";
import { spawnRandom } from "./animation/spawners";
import { spawnSpook } from "./animation/spook";
import { spawnSpring } from "./animation/spring";
import { spawnTrain } from "./animation/train";
import { spawnTumble } from "./animation/tumble";
import { config } from "./config";
import { randomTo } from "./util/random";

// expose a few things to the console

const global = (globalThis as any);

global.spawnFloat = spawnFloat;
global.spawnGonne = spawnGonne;
global.spawnMoon = spawnMoon;
global.spawnPeek = spawnPeek;
global.spawnRandom = spawnRandom;
global.spawnSpook = spawnSpook;
global.spawnSpring = spawnSpring;
global.spawnTrain = spawnTrain;
global.spawnTumble = spawnTumble;

// add nice helpers

const knownEmotes = [
	"11", // :)
	"emotesv2_5d523adb8bbb4786821cd7091e47da21", // PopNemo
	"emotesv2_c793467798a54ab2ab201c09c102c681", // MrKataHolz
	"emotesv2_43d2d01869474c7fa2cd7a07e2812923", // MrKataWorry
	"emotesv2_c5b61b5444334e27b4c65a37b2dc9476", // MrKataZombie
];
export function randomEmotes(count: number): string[] {
	return Array.from(
		{ length: count },
		(_, _2) => knownEmotes[Math.floor(randomTo(knownEmotes.length))]
	);
}

export function repeat<Ts extends any[]>(action: (...args: Ts) => void, times: number, delay: number, ...args: Ts): void {
	for (let i = 0; i < times; ++i) {
		setTimeout(action, i * delay, ...args);
	}
}
global.repeat = repeat;

document.body.onclick = () => {
	spawnRandom(randomEmotes(Math.floor(Math.random() * config.trainLength + 1)));
	//spawnSpring(randomEmotes(10));
};
