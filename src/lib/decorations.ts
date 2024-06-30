import Game from './game';
import Utils from './utils';

export default class Decorations {
	game: Game;

	decorations = [
		{
			id: 'tree1',
			spawnChances: 2,
			sx: 1,
			sy: 1.3,
			dx: 9,
			dy: 10,
		},
		{
			id: 'tree2',
			spawnChances: 2,
			sx: 1,
			sy: 1.5,
			dx: 9,
			dy: 15,
		},
		{
			id: 'stone1',
			spawnChances: 1,
			sx: 0.7,
			sy: 0.7,
			dx: 1.5,
			dy: 1,
		},
		{
			id: 'stone2',
			spawnChances: 1,
			sx: 0.7,
			sy: 0.7,
			dx: 2,
			dy: 1.2,
		},
		// {
		// 	id: 'weeds',
		// 	spawnChances: 10,
		// 	sx: 0.5,
		// 	sy: 0.25,
		// 	dx: 0.5,
		// 	dy: 0.3,
		// },
		{
			id: 'house1',
			spawnChances: 0,
			sx: 1,
			sy: 1,
			dx: 10,
			dy: 2,
		},
	];

	constructor(game: Game) {
		this.game = game;
	}

	generateDecoration() {
		// Build array to determine random dec
		const chances = this.decorations.reduce((acc: string[], curr) => {
			const _arr = Array(curr.spawnChances).fill(curr.id);
			return [...acc, ..._arr];
		}, []);
		const rd = Math.floor(Math.random() * chances.length * 8);

		if (!chances[rd]) return null;
		else return chances[rd];
	}

	draw(decoration: string, x: number, y: number, offsetX: number, offsetY: number) {
		const sprite = this.game.spriteSheets.find((s) => s.id == decoration)!.image;
		const data = this.decorations.find((d) => d.id == decoration);

		if (!sprite || !data) return;

		const isoCoords = Utils.cartToIso(
			x * this.game.settings.TILE_SIZE * this.game.map.zoom,
			y * this.game.settings.TILE_SIZE * this.game.map.zoom
		);

		const sx = this.game.settings.TILE_SIZE * this.game.map.zoom * data.sx;
		const sy = this.game.settings.TILE_SIZE * this.game.map.zoom * data.sy;

		this.game.ctx.drawImage(
			sprite,
			0,
			0,
			sprite.width,
			sprite.height,
			isoCoords.x + offsetX + sx / 2 + sprite.width / data.dx,
			isoCoords.y + offsetY - sy / 2 + sprite.height / data.dy,
			sx,
			sy
		);
	}
}
