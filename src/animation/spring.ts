import { config } from "../config";
import { randomizeSize, createEmoteElement, setEmoteSize, randomizeFlip, animateAndRemoveElement, randomizeZIndex } from "../emoteElement";
import { bluePathDisplay } from "../ui/PathDisplay";
import { randomIn, randomSign } from "../util/random";

export function spawnSpring(emoteIds: string[]): void {
	// randomize common appearance
	const baseScale = randomIn(.2, .4);
	const baseSizePx = baseScale * config.emoteBaseSize;
	const smallestDimension = Math.min(document.body.clientWidth, document.body.clientHeight);
	const baseHeight = randomIn(.7, .9) * smallestDimension;
	const baseWidth = randomIn(.6, .9) * baseHeight;
	const baseDuration = randomIn(1, 2) * baseHeight;
	const startX = Math.round(randomIn(baseWidth, document.body.clientWidth - baseWidth - baseSizePx));
	const spacing = randomIn(40, 80);
	const count = Math.round(randomIn(30, 60));
	// generate projectiles
	bluePathDisplay?.clear();
	for (let i = 0; i < count; ++i) {
		setTimeout(() => {
			const size = randomizeSize(baseScale);
			// randomize shape
			const sign = randomSign();
			const height = randomIn(.7, 1) * baseHeight;
			const width = randomIn(.7, 1) * baseWidth;
			// determine path points
			const startY = document.body.clientHeight;
			const endX = startX + Math.round(sign * width);
			const endY = document.body.clientHeight + size;
			const peakX = startX + ((endX - startX) / 2);
			const peakY = startY - Math.round(height);
			// set path
			const path = `M${startX} ${startY}S${startX} ${peakY},${peakX} ${peakY}S${endX} ${endY},${endX} ${endY}`;
			bluePathDisplay?.append(path);

			const keyframes: Keyframe[] = [
				{ offsetDistance: "0%", offsetRotate: "0turn" },
				{ offsetDistance: "100%", offsetRotate: `${sign * 5}turn` }
			];
			const options: KeyframeAnimationOptions = {
				duration: randomIn(0.9, 1.1) * baseDuration,
				iterations: 1,
				easing: "ease-in"
			};

			const element = createEmoteElement(emoteIds[i % emoteIds.length]);
			setEmoteSize(element, size);
			randomizeFlip(element);
			randomizeZIndex(element);
			element.style.offsetPath = `path("${path}")`;
			animateAndRemoveElement(element, keyframes, options);
		}, i * spacing);
	}
}
