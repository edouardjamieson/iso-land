import Decorations from './decorations';
import Map from './map';
import { getSettings } from './settings';
import TasksManager from './tasks';
import Tasks from './tasks';

interface gameOptions {
	onClickTile: (x: number, y: number) => void;
}

export default class Game {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	spriteSheets: { id: string; image: HTMLImageElement }[] = [];

	settings: any;
	options: gameOptions;
	map: Map;
	decorations: Decorations;
	tasksManager: TasksManager;

	loaded = false;

	tool = 'axe';

	constructor(options: gameOptions) {
		this.canvas = document.querySelector('#game-view') as HTMLCanvasElement;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

		this.options = options;

		// Load classes
		this.settings = getSettings();
		this.decorations = new Decorations(this);
		this.map = new Map(this);
		this.tasksManager = new TasksManager(this);

		// Setup events
		window.addEventListener('resize', this.resize.bind(this));
		this.update();
		this.resize();
		this.gui();

		this.load().then(() => {
			this.loaded = true;
		});
	}

	async load() {
		const spriteSheetsToLoad = [
			{
				id: 'grass',
				path: '/sprites/terrain/grass.png',
			},
			{
				id: 'tree1',
				path: '/sprites/decorations/tree1.png',
			},
			{
				id: 'tree2',
				path: '/sprites/decorations/tree2.png',
			},
			{
				id: 'stone1',
				path: '/sprites/decorations/stone1.png',
			},
			{
				id: 'stone2',
				path: '/sprites/decorations/stone2.png',
			},
			{
				id: 'weeds',
				path: '/sprites/decorations/weeds.png',
			},
			{
				id: 'house1',
				path: '/sprites/buildings/house1.png',
			},
			{
				id: 'road1000',
				path: '/sprites/terrain/road-1000.png',
			},
			{
				id: 'road0010',
				path: '/sprites/terrain/road-0010.png',
			},
		];

		for (let i = 0; i < spriteSheetsToLoad.length; i++) {
			const toLoad = spriteSheetsToLoad[i];
			const img = await new Promise((resolve, reject) => {
				const img = new Image();
				img.src = toLoad.path;
				img.onload = () => resolve(img);
			});

			this.spriteSheets.push({ id: toLoad.id, image: img as HTMLImageElement });
		}
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	update() {
		window.requestAnimationFrame(this.update.bind(this));
		if (!this.loaded) return;

		this.map.update();
		this.tasksManager.update();
	}

	gui() {
		// TOOLBAR
	}
}
