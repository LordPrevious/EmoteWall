export class Vector2 {
	constructor(public readonly x: number, public readonly y: number) {}

	add(other: Vector2): Vector2 {
		return new Vector2(this.x + other.x, this.y + other.y);
	}
	
	subtract(other: Vector2): Vector2 {
		return new Vector2(this.x - other.x, this.y - other.y);
	}

	multiply(factor: number): Vector2 {
		return new Vector2(this.x * factor, this.y * factor);
	}

	rotate(radians: number): Vector2 {
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);
		return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
	}

	get length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	in(x1: number, y1: number, x2: number, y2: number): boolean {
		return this.x > x1 && this.x < x2 && this.y > y1 && this.y < y2;
	}
}