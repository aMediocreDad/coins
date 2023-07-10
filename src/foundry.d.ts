declare class Hooks {
	static on(eventName: string, callback: (...args: Record<string, any>[]) => void): void;
}

declare module game {
	export const actors: {
		contents: Actor[];
	};

	export const user: {
		isGM: boolean;
		id: string;
	};

	export const socket: {
		emit: (eventName: string, data: Record<string, any>) => void;
		on: (eventName: string, callback: (...args: Record<string, any>[]) => void) => void;
	};
}

declare module ui {
	export const notifications: {
		error: (message: string) => void;
	};
}
