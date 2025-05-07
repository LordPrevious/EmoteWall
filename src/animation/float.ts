import { config } from "../config";
import { randomizeSize, createEmoteElement, setEmoteSize, randomizeFlip, animateAndRemoveElement, randomizeZIndex } from "../emoteElement";
import { blackPathDisplay } from "../ui/PathDisplay";
import { randomTo, randomSign, randomIn } from "../util/random";
import { Vector2 } from "../util/Vector2";

export function spawnFloat(emoteIds: string[]): void {
	const size = randomizeSize();

	// randomize initial directiona and spin sign
	let direction = new Vector2(0, 1).rotate(randomTo(2 * Math.PI));
	let sign = randomSign();
	// determine start position
	const center = new Vector2(document.body.clientWidth / 2, document.body.clientHeight / 2);
	const halfDiagonalLength = center.length;
	const perpendicularDirection = direction.rotate(sign * Math.PI / 2);
	const start = center.add(direction.multiply(-halfDiagonalLength))
		.add(perpendicularDirection.multiply(halfDiagonalLength / 2));
	const second = center.add(direction.multiply(-halfDiagonalLength / 4))
		.add(perpendicularDirection.multiply(-halfDiagonalLength / 4));
	// set path start position
	let path = `M${Math.round(start.x)} ${Math.round(start.y)}`;
	// add points on the curve
	const stepLength = halfDiagonalLength;
	let points: Vector2[] = [start, second];
	const maxDistance = (halfDiagonalLength + config.emoteBaseSize);
	let position = second;
	do {
		position = position.add(direction.multiply(stepLength));
		direction = direction.rotate(sign * randomIn(Math.PI / 6, Math.PI / 2));
		points.push(position);
		if (Math.random() < .05) { sign = -sign; }
	} while (center.subtract(position).length < maxDistance);
	// create smoothed path from the points
	const smoothingRatio = .2;
	points.forEach((point, index) => {
		// smooth curve to next point
		if (index > 0) {
			const previous = points[index - 1];
			const next = points[index + 1] ?? point;
			const opposedLine = previous.subtract(next);
			const control = point.add(opposedLine.multiply(smoothingRatio));
			path += `S${Math.round(control.x)} ${Math.round(control.y)},${Math.round(point.x)} ${Math.round(point.y)}`;
		}
	});
	blackPathDisplay?.set(path);

	const keyframes: Keyframe[] = [
		{ offsetDistance: "0%" },
		{ offsetDistance: "100%" }
	];
	const durationFactor = randomIn(.5, 2);
	const options: KeyframeAnimationOptions = {
		duration: durationFactor * (points.length + 2) * stepLength,
		iterations: 1
	};

	const spacing = durationFactor * size * randomIn(2, 3);
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
