import { config } from "../config";

class PathHost {
	readonly element: SVGSVGElement;

	constructor() {
		this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.element.setAttribute("width", "100%");
		this.element.setAttribute("height", "100%");
		document.body.appendChild(this.element);
	}
}

class PathDisplay {
	private element: SVGPathElement;

	constructor(host: PathHost, color: string) {
		this.element = document.createElementNS("http://www.w3.org/2000/svg", "path");
		this.element.setAttribute("d", "");
		this.element.setAttribute("stroke", color);
		this.element.setAttribute("fill", "transparent");
		host.element.appendChild(this.element);
	}

	get path(): string {
		return this.element.getAttribute("d") ?? "";
	}
	set path(value: string) {
		this.element.setAttribute("d", value);
	}

	clear() {
		this.path = "";
	}

	append(tail: string) {
		this.path += tail;
	}

	set(value: string) {
		this.path = value;
	}
}

const pathHost = config.pathDisplay ? new PathHost() : null;
export const blackPathDisplay = (pathHost != null) ? new PathDisplay(pathHost, "black") : null;
export const redPathDisplay = (pathHost != null) ? new PathDisplay(pathHost, "red") : null;
export const bluePathDisplay = (pathHost != null) ? new PathDisplay(pathHost, "blue") : null;
