<script lang="ts">
	import { type Writable } from "svelte/store";
	import { emit, range } from "./helpers.js";

	export let coins: Writable<number>;

	function flip(node: HTMLElement, index: number) {
		node.setAttribute("src", `modules/coins/assets/tails.webp`);

		const animation = node.animate(
			[{ transform: "rotate3d(0, 1, 0, 0deg)" }, { transform: "rotate3d(0, 1, 0, 360deg)" }],
			{
				duration: 500,
				easing: "ease-in-out",
			}
		);
		animation.cancel();

		const unsubscribe = coins.subscribe((numCoins) => {
			if (numCoins !== index) return;
			animation.play();
			setTimeout(() => node.setAttribute("src", `modules/coins/assets/heads.webp`), 250);
		});

		return {
			destroy() {
				unsubscribe();
			},
		};
	}
</script>

<!-- svelte-ignore missing-declaration -->
<button
	id="coins"
	data-tooltip="GM has {$coins} reroll{$coins > 1 || $coins === 0 ? 's' : ''}"
	data-tooltip-direction="UP"
	type="button"
	disabled={!game.user.isGM}
	on:click={() => {
		coins.update((n) => n + 1);
		emit({ coins: $coins });
	}}
	on:contextmenu={() => {
		coins.update((n) => Math.max(0, n - 1));
		emit({ coins: $coins });
	}}
>
	{#each range(1, $coins) as num}
		<img alt="coin" width="50" height="50" use:flip={num} />
	{:else}
		<span>GM has no rerolls</span>
	{/each}
</button>

<style>
	#coins {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 12px;
		max-width: 650px;
		padding: 12px 15px;
		pointer-events: all;
		cursor: unset;
		border: none;
		background: none;
	}

	#coins img {
		flex: none;
		border: none;
		width: 50px;
		height: 50px;
		padding: 0px;
		margin: 0px;
		transform: rotate3d(0, 1, 0, 0deg);
	}

	#coins span {
		font-size: var(--font-size-18);
		text-shadow: 0 0 10px white;
	}

	#coins:focus,
	#coins:hover {
		border: none;
		box-shadow: none !important;
	}

	#coins:not(:disabled):hover {
		filter: drop-shadow(0 0 10px rgba(166, 132, 77, 0.766));
	}
</style>
