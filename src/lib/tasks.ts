import Game from './game';
import { Tile } from './map';
import Utils from './utils';

interface Task {
	id: string;
	duration: number;
	content: string[];
	drops: string;
	dropAmount: number;
}
interface TaskItem {
	task: Task;
	runStart: number;
	x: number;
	y: number;
}

export const tasks: Task[] = [
	{
		id: 'chop_tree',
		duration: 7,
		content: ['tree1', 'tree2'],
		drops: 'wood',
		dropAmount: 2,
	},
];

export default class TasksManager {
	tasks: TaskItem[] = [];
	game: Game;

	constructor(game: Game) {
		this.game = game;
	}

	add(taskName: string, tile: Tile) {
		// Assign task
		const task = tasks.find((t) => t.id == taskName);
		if (!task) return;

		this.tasks.push({
			task,
			runStart: new Date().getTime(),
			x: tile.x,
			y: tile.y,
		});
	}

	update() {
		const toComplete: { taskItem: TaskItem; index: number }[] = [];

		for (let i = 0; i < this.tasks.length; i++) {
			const taskItem = this.tasks[i];
			const time = new Date().getTime();
			const diff = time - taskItem.runStart;

			// Check finish
			if (diff >= taskItem.task.duration * 1000) toComplete.push({ taskItem, index: i });
			else this.draw(taskItem);
		}

		for (let i = 0; i < toComplete.length; i++) {
			const _item = toComplete[i];
			this.complete(_item.taskItem, _item.index);
		}
	}

	draw(taskItem: TaskItem) {
		const offsetX = this.game.canvas.width / 2 + this.game.map.moveX;
		const offsetY = this.game.canvas.height / 2 - (this.game.settings.TILE_SIZE * this.game.settings.MAP_SIZE) / 2 + this.game.map.moveY;

		const isoCoords = Utils.cartToIso(
			taskItem.x * this.game.settings.TILE_SIZE * this.game.map.zoom,
			taskItem.y * this.game.settings.TILE_SIZE * this.game.map.zoom
		);

		const x = isoCoords.x + offsetX + this.game.settings.TILE_SIZE / 1.3;

		this.game.ctx.fillStyle = 'black';
		this.game.ctx.fillRect(x, isoCoords.y + offsetY, 50, 8);

		const diff = new Date().getTime() - taskItem.runStart;
		const completion = (diff / (taskItem.task.duration * 1000)) * 50;

		this.game.ctx.fillStyle = 'lime';
		this.game.ctx.fillRect(x, isoCoords.y + offsetY, completion, 8);
	}

	complete(taskItem: TaskItem, index: number) {
		// Calculate drop
		console.log('finish!');

		// Remove from array
		this.tasks.splice(index, 1);

		// Remove decoration from map
		const t = this.game.map.map.find((m) => m.x == taskItem.x && m.y == taskItem.y);
		if (t) t.content = null;
	}
}
