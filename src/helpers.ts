export function range(start: number, end: number): number[] {
	return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

export function emit(data: Record<string, any>): void {
	const id = game.user.id;
	game.socket.emit("module.coins", { id, ...data });
}

export function getCurrentCoins(): number {
	return game.actors.contents.reduce((total, actor) => {
		if (actor.type !== "character" || !actor.hasPlayerOwner) return total;
		return total + Math.max(0, actor.status.fate.value - actor.status.fortune.value);
	}, 0);
}
