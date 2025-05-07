export function randomBool(): Boolean {
	return Math.random() < .5;
}

export function randomSign(): number {
	return randomBool() ? -1 : 1;
}

export function randomIn(min: number, max: number) {
	return min + (Math.random() * (max - min));
}

export function randomTo(max: number) {
	return Math.random() * max;
}
