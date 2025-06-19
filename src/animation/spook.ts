import { randomizeSize, createEmoteElement, setEmoteSize, randomizeFlip, animateAndRemoveElement, randomizeZIndex } from "../emoteElement";
import { randomIn } from "../util/random";

export function spawnSpook(emoteIds: string[]): void {
	const size = randomizeSize(.8);
	const smallScale = randomIn(.7, .9);
	const height = size * randomIn(2.5, 3.5);
	const width = size * randomIn(3, 6);
	const top = randomIn(0, document.body.clientHeight - height);
	const left = randomIn(0, document.body.clientWidth - width);

	const opacityDuration = randomIn(3000, 6000);
	const opacityFrames: Keyframe[] = [
		{ opacity: 0, scale: smallScale, easing: "linear" },
		{ opacity: 0, scale: smallScale, offset: randomIn(.3, .5), easing: "ease-out" },
		{ opacity: randomIn(.5, .8), scale: 1, easing: "ease-in" }
	];
	const opacityOptions: KeyframeAnimationOptions = {
		duration: opacityDuration,
		iterations: Math.floor(randomIn(3, 6)) * 2, // must be even for proper vanishing
		direction: "alternate"
	};
	const verticalFrames: Keyframe[] = [
		{ top: `${top}px` },
		{ top: `${top + height - size}px` }
	];
	const verticalOptions: KeyframeAnimationOptions = {
		duration: randomIn(3000, 12000),
		iterations: Infinity,
		direction: "alternate",
		easing: "ease-in-out"
	};
	const horizontalFrames: Keyframe[] = [
		{ left: `${left}px` },
		{ left: `${left + width - size}px` }
	];
	const horizontalOptions: KeyframeAnimationOptions = {
		duration: randomIn(5000, 15000),
		iterations: Infinity,
		direction: "alternate",
		easing: "ease-in-out"
	};

	const spacing = opacityDuration * randomIn(.1, .4);
	emoteIds.forEach((emoteId, index) => {
		setTimeout(() => {
			const element = createEmoteElement(emoteId);
			setEmoteSize(element, size);
			randomizeFlip(element);
			randomizeZIndex(element);
			element.animate(verticalFrames, verticalOptions);
			element.animate(horizontalFrames, horizontalOptions);
			animateAndRemoveElement(element, opacityFrames, opacityOptions);
		}, index * spacing);
	});
}
