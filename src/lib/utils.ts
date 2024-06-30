import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default class Utils {
	static isoToCart(x: number, y: number) {
		const cartX = (2 * y + x) / 2;
		const cartY = (2 * y - x) / 2;
		return { x: cartX, y: cartY };
	}

	static cartToIso(x: number, y: number) {
		const isoX = x - y;
		const isoY = (x + y) / 2;
		return { x: isoX, y: isoY };
	}

	static getTileCoords(x: number, y: number, tileSize: number) {
		return {
			x: Math.floor(x / tileSize),
			y: Math.floor(y / tileSize),
		};
	}
}

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};
