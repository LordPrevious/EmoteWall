import { config } from "../config";
import { createEmoteElement, randomizeFlip, animateAndRemoveElement, randomizeZIndex } from "../emoteElement";
import { randomSign, randomTo, randomIn } from "../util/random";

export function spawnMoon(emoteIds: string[]): void {
	const offsetX = (Math.random() - .5) * config.emoteBaseSize;
	const offsetY = (Math.random() - .5) * config.emoteBaseSize;

	const sign = randomSign();
	const startRotation = randomTo(45) * sign;
	const endRotation = randomTo(45) * -sign;
	const endScale = randomIn(1, 2);
	const peakOpacity = randomIn(.7, .9);
	const keyframes: Keyframe[] = [
		{ transform: `rotate(${startRotation}deg) scale(0)`, opacity: 0 },
		{ offset: randomIn(.4, .6), opacity: peakOpacity },
		{ transform: `rotate(${endRotation}deg) scale(${endScale})`, opacity: 0 }
	];
	const maxDimension = Math.max(document.body.clientWidth, document.body.clientHeight);
	const duration = randomIn(2, 4) * maxDimension;
	const options: KeyframeAnimationOptions = {
		duration: duration,
		iterations: 1,
		easing: "ease-in-out"
	};

	const spacing = randomIn(100, Math.max(200, duration * .6));
	emoteIds.forEach((emoteId, index) => {
		setTimeout(() => {
			const element = createEmoteElement(emoteId);
			randomizeFlip(element);
			randomizeZIndex(element, 100);
			element.style.width = element.style.height = "100%";
			element.style.top = element.style.left = "0px";
			element.style.translate = `${offsetX}px ${offsetY}px`;
			animateAndRemoveElement(element, keyframes, options);
		}, index * spacing);
	});
}
