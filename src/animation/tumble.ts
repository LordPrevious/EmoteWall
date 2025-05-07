import { randomizeSize, createEmoteElement, setEmoteSize, randomizeFlip, animateAndRemoveElement, randomizeZIndex } from "../emoteElement";
import { redPathDisplay } from "../ui/PathDisplay";
import { randomTo, randomIn, randomBool } from "../util/random";
import { Vector2 } from "../util/Vector2";

export function spawnTumble(emoteIds: string[]): void {
	const size = randomizeSize(.7);

	// determine corner positions
	const halfSize = size / 2;
	const left = halfSize;
	const top = halfSize;
	const right = document.body.clientWidth - halfSize;
	const bottom = document.body.clientHeight - halfSize;
	const topLeft = new Vector2(left, top);
	const topRight = new Vector2(right, top);
	const bottomRight = new Vector2(right, bottom);
	const bottomLeft = new Vector2(left, bottom);

	// randomize where to start and how many edges to roll
	const startCornerIndex = Math.floor(randomTo(4));
	const numCorners = Math.floor(randomIn(2, 5));

	// rotate corners and reduce to as many we want
	let corners = [topLeft, topRight, bottomRight, bottomLeft];
	if (startCornerIndex !== 0) {
		corners = corners.slice(-startCornerIndex).concat(corners.slice(0, -startCornerIndex));
	}
	corners = corners.slice(0, numCorners);

	// push start and end corners outside the viewport
	let startCorner = corners[0];
	let endCorner = corners[corners.length - 1];
	const firstLine = corners[1].subtract(startCorner);
	const lastLine = corners[corners.length - 2].subtract(endCorner);
	corners[0] = startCorner.subtract(firstLine.multiply(1 / firstLine.length * size));
	corners[corners.length - 1] = endCorner.subtract(lastLine.multiply(1 / lastLine.length * size));

	// construct path from corners
	let path = "";
	corners.forEach((corner, index) => {
		const command = (index === 0) ? "M" : "L";
		path += `${command}${Math.round(corner.x)} ${Math.round(corner.y)}`;
	});
	redPathDisplay?.set(path);

	// get path length for accurate number of rotations
	let pathLength = 0;
	corners.reduce((previous, current) => {
		if (previous) {
			pathLength += current.subtract(previous).length;
		}
		return current;
	});

	const numTurns = pathLength / (size * Math.PI);
	const keyframes: Keyframe[] = [
		{ offsetDistance: "0%", offsetRotate: "0turn" },
		{ offsetDistance: "100%", offsetRotate: `${-numTurns}turn` }
	];
	const durationFactor = randomIn(1, 2);
	const options: KeyframeAnimationOptions = {
		duration: durationFactor * pathLength,
		iterations: 1,
		direction: randomBool() ? "normal" : "reverse"
	};

	const spacing = durationFactor * size * randomIn(1.1, 1.8);
	emoteIds.forEach((emoteId, index) => {
		setTimeout(() => {
			const element = createEmoteElement(emoteId);
			setEmoteSize(element, size);
			randomizeFlip(element);
			randomizeZIndex(element);
			element.style.offsetPath = `path("${path}")`;
			animateAndRemoveElement(element, keyframes, options);
		}, index * spacing);
	});
}
