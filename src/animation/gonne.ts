import { randomizeSize, createEmoteElement, randomizeFlip, animateAndRemoveElement, setEmoteSize, randomizeZIndex } from "../emoteElement";
import { redPathDisplay } from "../ui/PathDisplay";
import { randomIn, randomSign } from "../util/random";
import { Vector2 } from "../util/Vector2";

export function spawnGonne(emoteIds: string[]): void {
	// randomize common appearance
	const baseScale = randomIn(.4, .6);
	const baseDuration = randomIn(.5, 1) * document.body.clientWidth;
	const direction = randomSign();
	const height = randomIn(.1, .2) * document.body.clientHeight;
	const startY = Math.round(randomIn(document.body.clientHeight / 4, document.body.clientHeight / 4 * 3));
	const farY = startY - height;
	const farHeight = document.body.clientHeight - farY;
	const spacing = randomIn(300, 500);
	// ensure minimum number of projectiles
	if (emoteIds.length == 1) {
		const count = Math.floor(randomIn(3, 6));
		emoteIds = Array(count).fill(emoteIds[0]);
	} else if (emoteIds.length < 4) {
		emoteIds = emoteIds.concat(emoteIds);
	}
	// generate projectiles
	redPathDisplay?.clear();
	emoteIds.forEach((emoteId, index) => {
		setTimeout(() => {
			const size = randomizeSize(baseScale);
			// determine path points
			const startX = (direction > 0) ? -size : document.body.clientWidth;
			const farX = (direction > 0) ? document.body.clientWidth : 0;
			const endX = farX - direction * farHeight * randomIn(.5, 1.5);
			const endY = document.body.clientHeight + size;
			const endDistance = Math.abs((farX - endX) / document.body.clientWidth);
			const farControl = new Vector2(farX, farY).add(new Vector2(startX, startY).subtract(new Vector2(farX, farY)).multiply(endDistance));
			// set path
			const path = `M${startX} ${startY}L${farX} ${farY}C${farControl.x} ${farControl.y},${endX} ${endY},${endX} ${endY}`;
			redPathDisplay?.append(path);

			const keyframes: Keyframe[] = [
				{ offsetDistance: "0%", offsetRotate: "0turn" },
				{ offsetDistance: "100%", offsetRotate: `${direction * 5}turn` }
			];
			const options: KeyframeAnimationOptions = {
				duration: randomIn(0.9, 1.1) * baseDuration,
				iterations: 1
			};

			const element = createEmoteElement(emoteId);
			setEmoteSize(element, size);
			randomizeFlip(element);
			randomizeZIndex(element);
			element.style.offsetPath = `path("${path}")`;
			animateAndRemoveElement(element, keyframes, options);
		}, index * spacing);
	});
}
