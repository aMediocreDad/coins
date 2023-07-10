import { context } from "esbuild";
import svelte from "esbuild-svelte";
import { typescript } from "svelte-preprocess";

const watch = process.argv.includes("--watch");

const ctx = await context({
	entryPoints: ["src/init.ts"],
	outdir: "./",
	bundle: true,
	logLevel: "debug",
	plugins: [
		svelte({
			preprocess: typescript(),
		}),
	],
});

await ctx.rebuild();

if (watch) await ctx.watch();
else await ctx.dispose();
