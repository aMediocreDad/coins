import { get, writable } from "svelte/store";
import { emit, getCurrentCoins } from "./helpers.js";
import Coins from "./coins.svelte";

const coins = writable(0);

Hooks.on("ready", () => {
	game.socket.on("module.coins", (data) => {
		if (data.id === game.user.id) return;

		coins.set(data.coins);
	});

	const rootEl = $("footer#ui-bottom");
	if (!rootEl.length) ui.notifications.error("Could not find footer#ui-bottom");

	const currentCoins = getCurrentCoins();
	if (currentCoins > 0) coins.set(currentCoins);

	new Coins({
		target: rootEl[0],
		anchor: rootEl[0].firstElementChild as HTMLElement,
		intro: true,
		props: {
			coins,
		},
	});
});

Hooks.on("wfrp4e:rollTest", (data) => {
	const { actor, context, fortuneUsed } = data;

	if (fortuneUsed.SL || fortuneUsed.reroll) {
		coins.update((coins) => Math.min(coins + 1));
		emit({ coins: get(coins) });
	} else if (context.reroll && game.user.isGM && !actor.hasPlayerOwner) {
		coins.update((coins) => Math.max(0, coins - 1));
		emit({ coins: get(coins) });
	}
});
