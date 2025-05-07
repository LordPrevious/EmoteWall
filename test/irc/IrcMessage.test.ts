import { IrcMessage, parseIrcMessages } from "../../src/chat/IrcMessage";

test("Basic tags-prefix-arguments message", () => {
	const input = "@tag=value :prefix command arg1 arg2 :arg3 trailing";
	const parsed = parseIrcMessages(input);
	expect(parsed).toEqual<IrcMessage[]>([
		{
			command: "command",
			parameters: [
				"arg1",
				"arg2",
				"arg3 trailing"
			],
			sender: "prefix",
			emotes: [],
			isMod: false
		}
	]);
});

test("Pseudo twitch chat message", () => {
	const input = "@color=#FF0000;emotes=bla:22-30;mod=0 :username!username@username.tmi.twitch.tv PRIVMSG #channelname :A chat message with a blaEmote here";
	const parsed = parseIrcMessages(input);
	expect(parsed).toEqual<IrcMessage[]>([
		{
			command: "PRIVMSG",
			parameters: [
				"#channelname",
				"A chat message with a blaEmote here"
			],
			sender: "username",
			emotes: [
				"bla"
			],
			isMod: false
		}
	]);
});

test("Gib mod plz", () => {
	const input = "@color=#00FF00;mod=1 :importantuser@tmi.twitch.tv PRIVMSG #channelname :Am mod already";
	const parsed = parseIrcMessages(input);
	expect(parsed).toEqual<IrcMessage[]>([
		{
			command: "PRIVMSG",
			parameters: [
				"#channelname",
				"Am mod already"
			],
			sender: "importantuser",
			emotes: [],
			isMod: true
		}
	]);
});

test("Emote ordering matters", () => {
	const input = "@emotes=anemote:0-4,17-20,30-33/smile:6-10,40-44/frown:22-28 :prefix command arg";
	const parsed = parseIrcMessages(input);
	expect(parsed).toEqual<IrcMessage[]>([
		{
			command: "command",
			parameters: [
				"arg"
			],
			sender: "prefix",
			emotes: [
				"anemote",
				"smile",
				"anemote",
				"frown",
				"anemote",
				"smile"
			],
			isMod: false
		}
	]);
});

test("Multiple messages", () => {
	const input = "@tag=value command arg\r\n:prefix PRIVMSG :trailing arg here\r\nonly\r\n@mod=1 :user@twitch NOTICE #channel :A message here\r\n";
	const parsed = parseIrcMessages(input);
	expect(parsed).toEqual<IrcMessage[]>([
		{
			command: "command",
			parameters: [
				"arg"
			],
			sender: "",
			emotes: [],
			isMod: false
		},
		{
			command: "PRIVMSG",
			parameters: [
				"trailing arg here"
			],
			sender: "prefix",
			emotes: [],
			isMod: false
		},
		{
			command: "only",
			parameters: [],
			sender: "",
			emotes: [],
			isMod: false
		},
		{
			command: "NOTICE",
			parameters: [
				"#channel",
				"A message here"
			],
			sender: "user",
			emotes: [],
			isMod: true
		}
	]);
});
