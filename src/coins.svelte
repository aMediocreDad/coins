<script lang="ts">
	import { derived, type Writable } from "svelte/store";
	import { range } from "./helpers";

	export let coins: Writable<number>;
	export let totalFortune: number;

	const totalCoins = derived(coins, ($coins) =>
		range(1, totalFortune).map((num) => ({
			id: num,
			face: num > $coins ? "tails" : "heads",
		}))
	);

	function flip(node: HTMLElement, { id }: { id: number }) {
		let previousState = "heads";

		const img = node.querySelector("img");
		img?.setAttribute("src", `modules/coins/assets/${previousState}.webp`);

		const animation = node.animate(
			[{ transform: "rotate3d(0, 1, 0, 0deg)" }, { transform: "rotate3d(0, 1, 0, 180deg)" }],
			{
				duration: 300,
				easing: "ease-in-out",
				fill: "forwards",
			}
		);
		animation.cancel();

		const unsubscribe = totalCoins.subscribe((coins) => {
			const coin = coins.find((coin) => coin.id === id);

			if (coin && coin?.face !== previousState) {
				animation.play();
				setTimeout(() => img?.setAttribute("src", `modules/coins/assets/${coin.face}.webp`), 150);
				previousState = coin.face;
			}
		});

		return {
			destroy() {
				unsubscribe();
			},
		};
	}
</script>

<div
	id="coins"
	data-tooltip="GM has {$coins} reroll{$coins > 1 || $coins === 0 ? 's' : ''}"
	data-tooltip-direction="UP"
>
	{#each $totalCoins as { id }}
		<!-- svelte-ignore missing-declaration -->
		<button
			disabled={!game.user.isGM}
			type="button"
			use:flip={{ id }}
			on:click={() => {
				coins.update((n) => Math.min(totalFortune, n + 1));
				game.socket.emit("module.coins", { coins: $coins });
			}}
			on:contextmenu={() => {
				coins.update((n) => Math.max(0, n - 1));
				game.socket.emit("module.coins", { coins: $coins });
			}}
		>
			<img alt="coin" width="50" height="50" />
		</button>
	{/each}
</div>

<style>
	#coins {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 12px;
		max-width: 650px;
		padding: 12px 15px;
	}

	#coins button {
		box-sizing: border-box;
		pointer-events: all;
		border: none;
		background: none;
		width: 50px;
		height: 50px;
		padding: 0px;
		margin: 0px;
		cursor: unset;
		transform: rotate3d(0, 1, 0, 0deg);
		flex: none;
	}

	img {
		border: none;
	}

	#coins button:focus-within,
	#coins button:hover {
		box-shadow: none !important;
	}

	#coins button:not(:disabled):hover {
		filter: drop-shadow(0 0 10px rgba(166, 132, 77, 0.766));
	}
</style>
