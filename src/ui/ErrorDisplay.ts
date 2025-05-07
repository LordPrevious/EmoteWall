class ErrorDisplay {
	readonly element: HTMLElement;

	constructor() {
		this.element = document.createElement("div");
		this.element.classList.add("error");
		this.element.style.visibility = "collapse";
		document.body.appendChild(this.element);
	}

	show(message: string) {
		this.element.textContent = message;
		this.element.style.visibility = "visible";
	}

	clear() {
		this.element.style.visibility = "collapse";
		this.element.textContent = "";
	}
}

export const errorDisplay = new ErrorDisplay();
