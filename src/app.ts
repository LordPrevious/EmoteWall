/**
 * Mafalda's Emote Wall for Twitch.tv
 * Web: https://github.com/LordPrevious/EmoteWall
 * @license ISC
 */
import { TwitchIrcClient } from "./chat/TwitchIrcClient";

export const twitchIrcClient = (() => {
	try {
		return new TwitchIrcClient();
	} catch {
		return null;
	}
})();
