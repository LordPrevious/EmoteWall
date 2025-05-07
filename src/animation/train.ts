import { config } from "../config";
import { randomizeSize, createEmoteElement, randomizeFlip, animateAndRemoveElement, setEmoteSize } from "../emoteElement";
import { randomBool, randomIn } from "../util/random";

export function spawnTrain(emoteIds: string[]): void {
	const train = document.createElement("div");
	train.classList.add("train");
	document.body.appendChild(train);
	const locomotiveSize = randomizeSize();
	const cartSize = .7 * locomotiveSize;

	const direction = randomBool();

	const locomotiveIndex = emoteIds.length - 1;
	emoteIds.forEach((emoteId, index) => {
		const isLocomotive = (index === locomotiveIndex);
		const element = createEmoteElement(emoteId, isLocomotive ? "locomotive" : "cart", train);
		setEmoteSize(element, isLocomotive ? locomotiveSize : cartSize)
		randomizeFlip(element);
	});

	const trainWidth = locomotiveSize + (cartSize * (emoteIds.length - 1));
	const padding = trainWidth / 3;
	const leftEnd = -trainWidth - padding;
	const rightEnd = document.body.clientWidth + padding;
	const loopLength = rightEnd - leftEnd;
	const startLeft = direction ? leftEnd : rightEnd;
	const endLeft = direction ? rightEnd : leftEnd;
	const keyframes: Keyframe[] = [
		{ offset: 0, left: `${startLeft}px`, scale: "1 1" },
		{ offset: .5, left: `${endLeft}px`, scale: "1 1" },
		{ offset: .5, left: `${endLeft}px`, scale: "-1 1" },
		{ offset: 1, left: `${startLeft}px`, scale: "-1 1" }
	];
	const loops = Math.floor(randomIn(1, 3) * config.minTrainLoops);
	const options: KeyframeAnimationOptions = {
		duration: randomIn(3, 6) * loopLength,
		iterations: loops / 2,
		direction: direction ? "normal" : "reverse"
	};
	animateAndRemoveElement(train, keyframes, options);
}
