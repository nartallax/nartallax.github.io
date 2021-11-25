import {Point} from "common/common_types";

export interface WobblyCircleParams {
	radius: number;
	vertexCount: number;
	wobbliness: number;
}

export function generateWobblyCirclePoints(params: WobblyCircleParams): Point[] {
	let vertex = [] as Point[];

	// generating random circle-like points
	let currentDistance = params.radius;
	let degStep = (Math.PI * 2) / params.vertexCount;
	for(let i = 0; i < params.vertexCount; i++){
		let deg = (i * degStep);
		currentDistance += (currentDistance < params.radius? 1: -1) * params.radius * params.wobbliness * 0.25;
		currentDistance += (Math.random() - 0.5) * params.radius * params.wobbliness;
		vertex.push({
			x: Math.cos(deg) * currentDistance,
			// минус здесь - потому что в svg ось y направлена вниз
			// а мне привычнее, когда радианы идут по часовой стрелке при увеличении
			y: -Math.sin(deg) * currentDistance,
		})
	}

	return vertex;
}

