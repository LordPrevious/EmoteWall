// const enablePathDisplay = new URLSearchParams(location.search).has("showPaths");
const params = new URLSearchParams(location.search);

function clamp(value: number, min?: number, max?: number): number {
	return Math.min(Math.max(value, min??value), max??value);
}

function getInt(name: string, defaultValue: number, min?: number, max?: number): number {
	const raw = params.get(name);
	const parsed = raw ? parseInt(raw, 10) : NaN;
	const assured = isNaN(parsed) ? defaultValue : parsed;
	return clamp(assured, min, max);
}

function getFloat(name: string, defaultValue: number, min?: number, max?: number): number {
	const raw = params.get(name);
	const parsed = raw ? parseFloat(raw) : NaN;
	const assured = isNaN(parsed) ? defaultValue : parsed;
	return clamp(assured, min, max);
}

function getString(name: string, defaultValue: string): string {
	return params.get(name) ?? defaultValue;
}

function getList(name: string, defaultValue: string[]): string[] {
	return params.get(name)?.split(",") ?? defaultValue;
}

export const config = {
	/**
	 * Base emote size. Individual animations may increase or decrease it by a factor.
	 * Parameter and value in pixels.
	 */
	emoteBaseSize: getFloat("emoteSize", 150, 1),
	/**
	 * Plus-minus range around base size to generate some deviation.
	 * Parameter and value in pixels.
	 */
	emoteSizeDeviation: getFloat("emoteSizeDev", 25, 0),
	/**
	 * Chance for emotes from the same message to be passed to the same animation.
	 * Parameter and value as ratio.
	 */
	groupChance: getFloat("groupChance", .05, 0, 1),
	/**
	 * Number of emotes to place in a train.
	 * Emotes randomly get queued up for the train, which starts once this amount has been reached.
	 */
	trainLength: getInt("trainLength", 10, 1),
	/**
	 * Chance for an emote to be queued up for the next train.
	 * Parameter and value as ratio.
	 */
	trainChance: getFloat("trainChance", .25, 0, 1),
	/**
	 * Possible delay between cart arrival and train start. Thank you for travelling with Deutsche Bahn!
	 * Parameter in seconds, value in milliseconds.
	 */
	trainDelay: getFloat("trainDelay", 30, 0) * 1000,
	/**
	 * Trains should go at least this many loops (from one side to the other).
	 */
	minTrainLoops: getFloat("minLoops", 3, 1),
	/**
	 * IRC Websocket URL for the Twitch chat.
	 */
	chatHost: getString("chatHost", "wss://irc-ws.chat.twitch.tv:443/"),
	/**
	 * The twitch channel on which to listen for emotes.
	 */
	channel: getString("channel", ""),
	/**
	 * A list of especially privileged chatters in addition to the channel owner.
	 * These users may trigger special effects with secret chat commands.
	 */
	superUsers: getList("superUsers", ["marcmarkusmafaldabjorn"]),
	/**
	 * True to display offset paths for some animations.
	 */
	pathDisplay: params.has("showPaths"),
};
