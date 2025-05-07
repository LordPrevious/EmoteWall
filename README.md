# Mafalda's Emote Wall for Twitch.tv

A browser source stream overlay displaying emotes used in a Twitch chat.

Simply point a browser source in your streaming program, such as [OBS](https://obsproject.com/), to the HTML file. It can live locally on your computer. An IRC connection to Twitch.tv's chat is established via WebSockets.

Skip building it yourself by heading over to the [release collections](https://github.com/LordPrevious/EmoteWall/releases).

## Parameters

The Emote Wall can be configured using `GET` parameters in the URL.

| Parameter | Explanation |
| --- | --- |
| `channel` | **Required.** Name of the Twitch channel for which to display emotes. |
| `emoteSize` | Value in pixels from which emote sizes are derived. Allows adjusting to individual view sizes. |

For a comprehensive list, see [`src/config.ts`](./src/config.ts).

### Example URL

```txt
<www>/emotewall.html?channel=diebeleuchtetenbrueder&emoteSize=150
```

Subsitute `<www>` with your respective base URL.

## Build

[`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) is required. [`esbuild`](https://esbuild.github.io/) is used to bundle everything together.

```sh
npm install
npm run build
```

## Development

I usually run [`esbuild`](https://esbuild.github.io/) in watch mode, employing [`live-server`](https://github.com/tapio/live-server) to have an automatically refreshing browser window once I start the browser debugger in Visual Studio Code.

```sh
npm run build-watch
```

### Tests

[Jest](https://jestjs.io/) tests are available for select code.

```sh
npm test
```

## License

See [`LICENSE`](./LICENSE).
