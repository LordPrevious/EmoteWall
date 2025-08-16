import { appendTrain, scheduleTrain, spawnNamed, spawnRandom } from "../animation/spawners";
import { config } from "../config";
import { errorDisplay } from "../ui/ErrorDisplay";
import { randomIn } from "../util/random";
import { IrcMessage, parseIrcMessages } from "./IrcMessage";
import { isSuperUser } from "./superuser";

export class TwitchIrcClient {

	private webSocket: WebSocket

	constructor() {
		if (!config.channel) {
			errorDisplay.show("No channel configured.");
			throw new Error("No channel configured.");
		}
		this.webSocket = this.createWebSocket();
	}

	/**
	 * Creates a WebSocket to communicate with Twitch chat and attaches relevant event handlers.
	 * @returns The WebSocket.
	 */
	private createWebSocket(): WebSocket {
		errorDisplay.show("Connecting...");
		const webSocket = new WebSocket(config.chatHost, "irc");
		webSocket.onclose = this.webSocketOnClose.bind(this)
		webSocket.onerror = this.webSocketOnError.bind(this)
		webSocket.onmessage = this.webSocketOnMessage.bind(this)
		webSocket.onopen = this.webSocketOnOpen.bind(this)
		return webSocket;
	}

	/**
	 * Cleans up a WebSocket created with createWebSocket(), removing the event handlers.
	 * @param webSocket The WebSocket to clean up. Will not be closed.
	 */
	private cleanupWebSocket(webSocket: WebSocket): void {
		webSocket.onclose = null;
		webSocket.onerror = null;
		webSocket.onmessage = null;
		webSocket.onopen = null;
	}

	/**
	 * Recreate the WebSocket to attempt a new connection.
	 */
	private reconnect(): void {
		this.cleanupWebSocket(this.webSocket);
		this.webSocket = this.createWebSocket();
	}
	
	/**
	 * Request special IRC capabilities for Twitch chat.
	 * Tags need to be requested to be received, and we need them for emote information.
	 */
	private requestCapabilities(): void {
		this.webSocket.send("CAP REQ :twitch.tv/tags");
	}
	
	/**
	 * Perform an anonymous login by pseudo-authenticating as justinfan.
	 */
	private performLogin(): void {
		this.webSocket.send(`NICK justinfan${Math.floor(randomIn(5000, 80000))}`);
	}

	private handleSpecialCommands(message: IrcMessage): boolean {
		var success = false;
		if (isSuperUser(message.sender)) {
			const content = message.parameters[message.parameters.length - 1].toLowerCase();
			const command = content.split(" ").find(word => {
				return word.startsWith(":") && word.endsWith(":");
			});
			if (command) {
				const parts = command.split(":");
				if (parts.length > 2) {
					if (message.emotes.length > 0) {
						const spawnerName = `spawn${parts[1] || "randomgrouped"}`;
						const rawRepeats = parts[3] ? parseInt(parts[3], 10) : NaN;
						const repeats = isNaN(rawRepeats) ? 1 : Math.max(rawRepeats, 1);
						console.log("Special spawn:", spawnerName, repeats);
						const emotes = [...message.emotes];
						for (let i = 1; i < repeats; ++i) {
							emotes.push(...message.emotes);
						}
						switch (parts[2]) {
							case "t":
								appendTrain(...emotes);
								success = true;
								break;
							case "s":
								emotes.forEach(emote => {
									success = spawnNamed(spawnerName, [emote]) || success;
								});
								break;
							case "g":
							case "":
								success = spawnNamed(spawnerName, emotes);
								break;
						}
					} else {
						switch (parts[1]) {
							case "train":
								console.log("Special train time!");
								scheduleTrain();
								break;
						}
					}
				}
			}
		}
		return success;
	}

	/**
	 * Handle a received IRC message and act accordingly.
	 * @param message A received message.
	 */
	protected handleMessage(message: IrcMessage): void {
		switch (message.command) {
			case "PING":
				this.webSocket.send("PONG");
				break;
			case "376": //RPL_ENDOFMOTD
				console.log("Joining channel...");
				this.webSocket.send(`JOIN #${config.channel}`);
				break;
			case "JOIN":
				console.log("Joined channel!");
				errorDisplay.clear();
				break;
			case "PART":
				console.log("Parted from channel.");
				errorDisplay.show("Left channel.");
				break;
			case "PRIVMSG":
				if (this.handleSpecialCommands(message)) {
					// skip default handling
					return;
				}
				break;
		}
		if (message.emotes.length > 0) {
			spawnRandom(message.emotes);
		}
	}

	private webSocketOnClose(event: CloseEvent): void {
		console.log("WebSocket close event:", event.code);
		errorDisplay.show("Connection closed.");
		this.reconnect();
	}

	private webSocketOnError(_: Event): void {
		console.log("WebSocket error occurred.")
	}

	private webSocketOnMessage(event: MessageEvent<string>): void {
		console.log("WebSocket message received:", event.data);
		try {
			parseIrcMessages(event.data).forEach(message => this.handleMessage(message));
		} catch (error) {
			console.log("WebSocket message parsing failed:", error);
		}
	}

	private webSocketOnOpen(_: Event): void {
		this.requestCapabilities();
		this.performLogin();
	}
	
}
