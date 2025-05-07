import * as esbuild from 'esbuild';

const args = process.argv.slice(2);
const prod = args.some(value => { return value === "--prod"; });
const watch = args.some(value => { return value === "--watch"; });

const buildOptions = {
	banner: {
		js: "// Mafalda's Emote Wall for Twitch.tv",
	},
	bundle: true,
	drop: prod ? [ "console", "debugger" ] : [],
	dropLabels: prod ? [ "DEV" ] : [],
	entryPoints: [ prod ? "./src/app.ts" : "./src/debug.ts" ],
	format: "iife",
	globalName: "emoteWall",
	minify: prod,
	outfile: './www/emotewall.js',
	sourcemap: !prod,
};

if (watch) {
	const ctx = await esbuild.context(buildOptions);
	await ctx.watch();
	console.log("Watching...");
} else {
	await esbuild.build(buildOptions);
}
