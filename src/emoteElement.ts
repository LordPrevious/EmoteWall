import { config } from "./config";
import { randomIn, randomSign, randomTo } from "./util/random";

export function createEmoteElement(
	emoteId: string,
	className: string = "emote",
	parent: HTMLElement = document.body
): HTMLImageElement {
	const element = document.createElement("img");
	element.classList.add(className);
	element.src = `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/3.0`;
	parent.appendChild(element);
	return element;
}

export function setEmoteSize(element: HTMLElement, size: number) {
	element.style.width = element.style.height = `${size}px`;
}

export function randomizeSize(scale: number = 1): number {
	const baseSize = config.emoteBaseSize;
	const deviation = baseSize * config.emoteSizeVariation;
	return (baseSize + (randomSign() * randomTo(deviation))) * scale;
}

export function randomizeEmoteSize(element: HTMLElement, scale: number = 1): number {
	const size = randomizeSize(scale);
	setEmoteSize(element, size);
	return size;
}

export function randomizeFlip(element: HTMLElement): void {
	const flip = randomSign();
	element.style.transform = `scaleX(${flip})`;
}

export function randomizeZIndex(element: HTMLElement, base: number = 10): void {
	element.style.zIndex = Math.round(base + randomIn(-5, 5)).toString();
}

export function animateAndRemoveElement(
	element: HTMLElement,
	keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
	options?: number | KeyframeAnimationOptions
): void {
	const animation = element.animate(keyframes, options);
	animation.onfinish = () => {
		element.remove();
	};
}
