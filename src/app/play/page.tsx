'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import Game from '../../lib/game';
import { cn } from '@/lib/utils';
import { Axe, CircleDollarSign, Clock, Menu, Pickaxe, Scissors, Shovel } from 'lucide-react';

export default function Play() {
	const [tool, setTool] = useState('axe');
	const game = useRef<null | Game>(null);

	useEffect(() => {
		game.current = new Game({
			onClickTile: handleSelectTile,
		});
	}, []);

	const handleSelectTile = (x: number, y: number) => {
		// Find tile
		const tile = game.current?.map.map.find((m) => m.x == x && m.y == y);
		if (!tile || !tile.content) return;

		console.log(tool);

		if (tool == 'axe') {
			game.current?.tasksManager.add('chop_tree', tile);
		}
	};

	return (
		<>
			<canvas id="game-view"></canvas>
			<div className="gui w-full absolute top-0 left-0 h-full pointer-events-none">
				{/* Top */}
				<div className="w-full p-4 flex pointer-events-auto gap-4 items-center">
					<Panel className="grid grid-cols-4 p-1 gap-1">
						<button
							type="button"
							id="tool-axe"
							onClick={() => setTool('axe')}
							className={cn('aspect-square p-2 rounded-md bg-panel-border flex items-center justify-center', {
								'border-4 border-black  text-white': tool == 'axe',
							})}
						>
							<Axe />
						</button>
						<button
							type="button"
							id="tool-pickaxe"
							onClick={() => setTool('pickaxe')}
							className={cn('aspect-square p-2 rounded-md bg-panel-border flex items-center justify-center', {
								'border-4 border-black  text-white': tool == 'pickaxe',
							})}
						>
							<Pickaxe />
						</button>
						<button
							type="button"
							id="tool-hoe"
							onClick={() => setTool('hoe')}
							className={cn('aspect-square p-2 rounded-md bg-panel-border flex items-center justify-center', {
								'border-4 border-black  text-white': tool == 'hoe',
							})}
						>
							<Scissors />
						</button>
						<button
							type="button"
							id="tool-shovel"
							onClick={() => setTool('shovel')}
							className={cn('aspect-square p-2 rounded-md bg-panel-border flex items-center justify-center', {
								'border-4 border-black  text-white': tool == 'shovel',
							})}
						>
							<Shovel />
						</button>
					</Panel>
					<Panel>
						<CircleDollarSign />
						<span>456</span>
					</Panel>
					<Panel>
						<Clock />
						<span>10:10 AM</span>
					</Panel>
				</div>

				{/* Modal */}
				<div className="absolute w-full p-4 bottom-0 pointer-events-auto">
					<Panel>
						<button
							type="button"
							className="absolute right-10 -top-1 bg-panel-fg border-l-4 border-r-4 border-t-4 border-black px-4 rounded-t-md text-sm"
						>
							Close
						</button>
						yoooooo
					</Panel>
				</div>
			</div>
		</>
	);
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				'bg-panel-fg border-4 border-panel-border outline-black outline-4 outline rounded-md px-4 py-2 font-bold flex items-center gap-2',
				className
			)}
		>
			{children}
		</div>
	);
}

export function Button({ children, className, onClick }: { children: ReactNode; className?: string; onClick: () => void }) {
	return (
		<button type="button" onClick={onClick}>
			<Panel className={className}>{children}</Panel>
		</button>
	);
}
