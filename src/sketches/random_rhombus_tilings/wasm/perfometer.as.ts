export const enum RhombusMetrics {
	prepare = 0,
	findCandidate = 1,
	flip = 2,

	count
}

export function recordMetric(name: RhombusMetrics, time: f64): void {
	metricsArray[name] += time
}

export function clearMetrics(): void {
	for(let i = 0; i < RhombusMetrics.count; i++){
		metricsArray[i] = 0
	}
}

export const metricsArray = new Float64Array(RhombusMetrics.count)