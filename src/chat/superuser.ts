import { config } from "../config";

const superUsers: string[] = [config.channel.toLowerCase()].concat(
	config.superUsers.map(item => item.toLowerCase())
)

export function isSuperUser(name: string): boolean {
	return superUsers.find(item => item == name.toLowerCase()) !== undefined;
}
