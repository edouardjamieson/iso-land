import Game from './game';
import Utils from './utils';

export interface Tile {
	x: number;
	y: number;
	type: string;
	content: any;
}

export default class Map {
	game: Game;
	zoom = 1;
	map: Tile[];

	moveX: number = 0;
	moveY: number = 0;
	mouseDown: boolean = false;

	mouseX: number = 0;
	mouseY: number = 0;

	hoveringCoords = { x: 0, y: 0 };

	constructor(game: Game) {
		this.game = game;

		// Setup events
		window.addEventListener('wheel', this.handleScroll.bind(this));
		game.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
		game.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
		game.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
		game.canvas.addEventListener('click', this.handleClick.bind(this));

		this.map = this.generateMap();
	}

	generateMap() {
		const tileMap: Tile[] = [];

		for (let y = 0; y < this.game.settings.MAP_SIZE; y++) {
			for (let x = 0; x < this.game.settings.MAP_SIZE; x++) {
				let type = 'grass';
				let content: string | null = null;

				// Check for starter buildings
				if (x == 20 && y == 20) {
					content = 'house1';
				}

				// if (x == 22 && y == 20) {
				// 	content = 'weeds';
				// }

				// Check to spawn item
				if (!content) content = this.game.decorations.generateDecoration();

				tileMap.push({
					x,
					y,
					type,
					content,
				});
			}
		}

		return tileMap;
	}

	update() {
		this.draw();
	}

	draw() {
		// Draw backgrounad
		this.game.ctx.fillStyle = 'black';
		this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

		this.game.ctx.imageSmoothingEnabled = true;
		this.game.ctx.imageSmoothingQuality = 'high';

		const offsetX = this.game.canvas.width / 2 + this.moveX;
		const offsetY = this.game.canvas.height / 2 - (this.game.settings.TILE_SIZE * this.game.settings.MAP_SIZE) / 2 + this.moveY;
		const xMouseIso = this.mouseX - offsetX;
		const yMouseIso = this.mouseY - offsetY;

		const sizeX = this.game.settings.TILE_SIZE * 2.2 * this.zoom;
		const sizeY = this.game.settings.TILE_SIZE * 2 * this.zoom;

		// Find all possible hover tiles
		const tileToHover = this.map
			.filter((t) => {
				const _isoCoords = Utils.cartToIso(t.x * this.game.settings.TILE_SIZE * this.zoom, t.y * this.game.settings.TILE_SIZE * this.zoom);
				const hoverOnX = xMouseIso >= _isoCoords.x && xMouseIso <= _isoCoords.x + sizeX;
				const hoverOnY = yMouseIso >= _isoCoords.y && yMouseIso <= _isoCoords.y + sizeY;
				return hoverOnX && hoverOnY;
			})
			.sort((a, b) => {
				const _isoCoordsA = Utils.cartToIso(a.x * this.game.settings.TILE_SIZE * this.zoom, a.y * this.game.settings.TILE_SIZE * this.zoom);
				const _isoCoordsB = Utils.cartToIso(b.x * this.game.settings.TILE_SIZE * this.zoom, b.y * this.game.settings.TILE_SIZE * this.zoom);
				// return xMouseIso - _isoCoordsA.x > xMouseIso - _isoCoordsB.x ? -1 : yMouseIso - _isoCoordsA.y > yMouseIso - _isoCoordsB.y ? 1 : -1;
				return yMouseIso - _isoCoordsA.y > yMouseIso - _isoCoordsB.y ? -1 : xMouseIso - _isoCoordsA.x > xMouseIso - _isoCoordsB.x ? 1 : -1;
			});

		// TILES
		for (let t = 0; t < this.map.length; t++) {
			const { type, x, y, content } = this.map[t];

			const sprite = this.game.spriteSheets.find((s) => s.id == type)!.image;
			const isoCoords = Utils.cartToIso(x * this.game.settings.TILE_SIZE * this.zoom, y * this.game.settings.TILE_SIZE * this.zoom);

			const isHovering = tileToHover.length > 0 && tileToHover[0].x == x && tileToHover[0].y == y;

			// this.game.ctx.fillStyle = isHovering ? 'blue' : 'red';
			// this.game.ctx.fillRect(isoCoords.x + offsetX, isoCoords.y + offsetY, sizeX, sizeY);

			if (isHovering) {
				this.game.ctx.save();
				this.game.ctx.filter = 'brightness(150%)';
				this.hoveringCoords = { x, y };
			}
			this.game.ctx.drawImage(sprite, 0, 0, sprite.width, sprite.height, isoCoords.x + offsetX, isoCoords.y + offsetY, sizeX, sizeY);
			this.game.ctx.restore();

			this.game.ctx.fillStyle = 'white';
			// this.game.ctx.fillText(
			// 	`(${x}, ${y})`,
			// 	isoCoords.x + offsetX + this.game.settings.TILE_SIZE / 2,
			// 	isoCoords.y + offsetY + this.game.settings.TILE_SIZE / 2
			// );
			// this.game.ctx.fillText(
			// 	`(${isoCoords.x}, ${isoCoords.y})`,
			// 	isoCoords.x + offsetX + this.game.settings.TILE_SIZE / 2,
			// 	isoCoords.y + offsetY + this.game.settings.TILE_SIZE / 2
			// );
		}

		// DECORATIONS
		for (let t = 0; t < this.map.length; t++) {
			const { content, x, y } = this.map[t];
			if (!content) continue;

			this.game.decorations.draw(content, x, y, offsetX, offsetY);
		}
	}

	handleScroll(e: WheelEvent) {
		const minZoom = 0.5;
		const maxZoom = 1.5;

		let _z = this.zoom;

		if (e.deltaY < 0) _z += 0.2;
		else _z -= 0.2;

		if (_z >= maxZoom) _z = maxZoom;
		if (_z <= minZoom) _z = minZoom;

		// this.zoom = _z;
	}

	handleMouseDown(e: MouseEvent) {
		this.mouseDown = true;
	}
	handleMouseUp(e: MouseEvent) {
		this.mouseDown = false;
	}
	handleMouseMove(e: MouseEvent) {
		e.preventDefault();

		// Move map
		if (this.mouseDown == true) {
			const max = 1050;
			const threshold = Math.abs(0.3 * this.zoom);

			let mx = this.moveX + e.movementX * threshold;
			let my = this.moveY + e.movementY * threshold;

			if (Math.abs(mx) >= max) mx = max * Math.sign(mx);
			if (Math.abs(my) >= max) my = max * Math.sign(my);

			this.moveX = mx;
			this.moveY = my;
		}

		// Detect hover tile
		this.mouseX = e.x;
		this.mouseY = e.y;
	}
	handleClick() {
		// Check if is hovering coords & has content
		const hoverTileHasContent = this.map.find((m) => m.x == this.hoveringCoords.x && m.y == this.hoveringCoords.y)?.content != null;
		if (hoverTileHasContent) this.game.options.onClickTile(this.hoveringCoords.x, this.hoveringCoords.y);
	}
}
