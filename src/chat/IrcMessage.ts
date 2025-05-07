/**
 * Data parsed from an IRC message.
 */
export type IrcMessage = {
	/**
	 * IRC message command, such as PRIVMSG, PING.
	 */
	command: string,
	/**
	 * Optional arguments to the command.
	 */
	parameters: string[],
	/**
	 * Message sender extracted from prefix
	 */
	sender: string,
	/**
	 * List of emotes from IRC message tags.
	 * These are parsed and may occur regardless of command.
	 */
	emotes: string[],
	/**
	 * Flag for the message author's mod status.
	 */
	isMod: boolean,
}

/**
 * Parse the message's Twitch emotes from their tag.
 * @param raw The "emotes" tag value.
 * @returns A list of parsed emotes in order of occurrence in the message.
 */
function parseEmotes(raw?: string): string[] {
	return raw?.split("/")?.filter(s => s)?.flatMap(emotePositions => {
		const [emoteId, positions] = emotePositions.split(":", 2);
		return positions.split(",").map(position => {
			const [start, _] = position.split("-", 2);
			return {
				emoteId: emoteId,
				start: parseInt(start)
			};
		});
	}).sort((a, b) => {
		return a.start - b.start;
	}).map(it => it.emoteId) ?? [];
}

/**
 * Parse the message's prefix, which usually indicates the message origin.
 * The tags are optional and prefixed by "@".
 * @param raw The raw IRC message.
 * @param offset The offset where the tags start.
 * @returns The parsed tags and the offset behind it, after the trailing space.
 */
function parseTags(raw: string, offset: number): {
	emotes: string[],
	isMod: boolean,
	tagsEnd: number
} {
	let emotes: string[] = []
	let isMod = false;
	let tagsEnd = offset;
	if (raw.charAt(offset) === "@") {
		tagsEnd = raw.indexOf(" ", offset + 1);
		if (tagsEnd < 0) {
			tagsEnd = raw.length;
		}
		const rawTags = raw.substring(offset + 1, tagsEnd).split(";").filter(s => s);
		rawTags.forEach(rawTag => {
			const [ key, value ] = rawTag.split("=", 2);
			switch (key) {
				case "emotes":
					emotes = parseEmotes(value);
					break;
				case "mod":
					isMod = (value === "1");
					break;
			}
		});
		++tagsEnd;
	}
	return { emotes, isMod, tagsEnd };
}

/**
 * Parse the message's prefix, which usually indicates the message origin.
 * The prefix is optional and prefixed by ":".
 * @param raw The raw IRC message.
 * @param offset The offset where the prefix starts.
 * @returns The parsed prefix and the offset behind it, after the trailing space.
 */
function parsePrefix(raw: string, offset: number): { sender: string, prefixEnd: number } {
	let prefix = "";
	let prefixEnd = offset;
	if (raw.charAt(offset) === ":") {
		prefixEnd = raw.indexOf(" ", offset + 1);
		if (prefixEnd < 0) {
			prefixEnd = raw.length;
		}
		prefix = raw.substring(offset + 1, prefixEnd);
		++prefixEnd;
	}
	const sender = prefix.split("@", 1)[0].split("!", 1)[0];
	return { sender, prefixEnd };
}

/**
 * Parse the messages command, which is the central part after the optional tags and prefix and before the
 * optional parameters.
 * @param raw The raw IRC message.
 * @param offset The offset where the command starts.
 * @returns The parsed command and the offset behind it, before the trailing space.
 */
function parseCommand(raw: string, offset: number): { command: string, commandEnd: number } {
	let commandEnd = raw.indexOf(" ", offset + 1);
	if (commandEnd < 0) {
		commandEnd = raw.length;
	}
	const command = raw.substring(offset, commandEnd);
	return { command, commandEnd };
}

/**
 * Parse the message's parameters, which are separated by whitespace until a colon indicates that the entire
 * remainder is the last parameter, which then may contain whitespace.
 * For the parameters, the *leading* whitespace is part of the format.
 * @param raw The raw IRC message.
 * @param offset The offset where the parameters start, including the leading whitespace.
 * @returns The parsed parameters.
 */
function parseParameters(raw: string, offset: number): string[] {
	const [ singles, trailing ] = raw.substring(offset).split(" :", 2);
	const parameters = singles ? singles.split(" ").filter(s => s) : [];
	if (trailing !== undefined) {
		parameters.push(trailing);
	}
	return parameters;
}

/**
 * Parse a single IRC message of the format
 * "@tags=value :prefix command argument argument :trailing-argument"
 * @param raw The raw IRC message without trailing line break.
 * @returns The parsed message.
 */
function parseIrcMessage(raw: string): IrcMessage {
	const { emotes, isMod, tagsEnd } = parseTags(raw, 0);
	const { sender, prefixEnd } = parsePrefix(raw, tagsEnd);
	const { command, commandEnd } = parseCommand(raw, prefixEnd);
	const parameters = parseParameters(raw, commandEnd);
	return { command, parameters, sender, emotes, isMod };
}

/**
 * Parse multiple IRC messages of the format
 * "@tags=value :prefix command argument argument :trailing-argument\r\n"
 * @param raw The raw IRC messages including separating and trailing line breaks.
 * @returns The parsed messages
 */
export function parseIrcMessages(raw: string): IrcMessage[] {
	return raw.split("\r\n").filter(s => s).map(parseIrcMessage);
}
