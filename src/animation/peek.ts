import { randomizeSize, createEmoteElement, setEmoteSize, randomizeFlip, animateAndRemoveElement, randomizeZIndex } from "../emoteElement";
import { randomTo, randomIn } from "../util/random";

export function spawnPeek(emoteIds: string[]): void {
	const size = randomizeSize(1.5);
	const widthPerEmote = document.body.clientWidth / emoteIds.length;
	const bufferWidth = widthPerEmote - size;
	const baseDuration = randomIn(2000, 4000);
	emoteIds.forEach((emoteId, index) => {
		const left = index * widthPerEmote + randomTo(bufferWidth);
	
		const keyframes: Keyframe[] = [
			{ bottom: `-${size}px` },
			{ offset: randomIn(.3, .6), bottom: "0px" },
			{ offset: .95, bottom: "0px" },
			{ bottom: `-${size}px` }
		];
		const options: KeyframeAnimationOptions = {
			duration: baseDuration * randomIn(.9, 1.1),
			iterations: 1
		};

		const element = createEmoteElement(emoteId);
		setEmoteSize(element, size);
		randomizeFlip(element);
		randomizeZIndex(element);
		element.style.top = "unset";
		element.style.left = `${left}px`;
		animateAndRemoveElement(element, keyframes, options);
	});
}
