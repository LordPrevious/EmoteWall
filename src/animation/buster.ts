import { randomizeSize, createEmoteElement, setEmoteSize, randomizeFlip, animateAndRemoveElement, randomizeZIndex, randomizeEmoteSize } from "../emoteElement";
import { randomTo, randomIn } from "../util/random";

export function spawnBuster(emoteIds: string[]): void {
	const face = emoteIds[Math.floor(randomTo(emoteIds.length))];
	const size = randomizeSize();
	const top = randomTo(document.body.clientHeight - size);
	const left = randomTo(document.body.clientWidth - size);
	const centerY = top + (size / 2);
	const centerX = left + (size / 2);

	const appearKeyframes: Keyframe[] = [
		{ scale: 0, opacity: 0 },
		{ scale: 0.2, offset: .2 },
		{ scale: 0.2, opacity: 1, offset: .35 },
		{ scale: 1, offset: .4 },
		{ scale: 1.2 },
		{ scale: 1, offset: .5 }
	];
	const appearOptions: KeyframeAnimationOptions = {
		duration: randomIn(3000, 6000),
		easing: "ease-out"
	};

	const faceElement = createEmoteElement(face);
	setEmoteSize(faceElement, size);
	randomizeFlip(faceElement);
	randomizeZIndex(faceElement);
	faceElement.style.top = `${top}px`;
	faceElement.style.left = `${left}px`;

	const appearAnimation = faceElement.animate(appearKeyframes, appearOptions);
	appearAnimation.onfinish = () => {
		const redFilter = "sepia(100%) hue-rotate(-40deg) brightness(80%) contrast(150%) saturate(150%)";
		const bigScale = 1.2;
		const pulseKeyframes: Keyframe[] = [
			{ filter: "none" }
		];
		const pulseCount = Math.floor(randomIn(40, 60));
		for (var i = 0; i < pulseCount; ++i) {
			pulseKeyframes.push({ scale: 1 });
			pulseKeyframes.push({ scale: bigScale });
		}
		pulseKeyframes.push({ filter: redFilter });
		const pulseOptions: KeyframeAnimationOptions = {
			duration: randomIn(6000, 15000),
			easing: "ease-in"
		};
		const pulseAnimation = faceElement.animate(pulseKeyframes, pulseOptions);
		const shrapnelDuration = randomIn(1000, 4000);
		pulseAnimation.onfinish = () => {
			faceElement.remove();
			const shrapnelCount = Math.floor(randomIn(40, 70));;
			for (var i = 0; i < shrapnelCount; ++i) {
				const shrapnel = emoteIds[i % emoteIds.length];
				const shrapnelElement = createEmoteElement(shrapnel);
				const shrapnelSize = randomizeEmoteSize(shrapnelElement, .3);
				randomizeFlip(shrapnelElement);
				randomizeZIndex(shrapnelElement);
				const distance = Math.max(document.body.clientWidth, document.body.clientHeight);
				const radian = (i + randomTo(1)) / shrapnelCount * 2 * Math.PI;
				const startTop = centerY - (shrapnelSize / 2);
				const endTop = startTop + (distance * Math.sin(radian));
				const startLeft = centerX - (shrapnelSize / 2);
				const endLeft = startLeft + (distance * Math.cos(radian));
				shrapnelElement.style.rotate = `${randomTo(360)}deg`;
				
				const shrapnelKeyframes: Keyframe[] = [
					{ opacity: 1, top: `${startTop}px`, left: `${startLeft}px` },
					{ opacity: 0, top: `${endTop}px`, left: `${endLeft}px` },
				];
				const shrapnelOptions: KeyframeAnimationOptions = {
					duration: shrapnelDuration * randomIn(.9, 1.1),
					easing: "ease-out"
				};
				animateAndRemoveElement(shrapnelElement, shrapnelKeyframes, shrapnelOptions);
			}
		};
	};
}
