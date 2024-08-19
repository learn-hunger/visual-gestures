export function distance(
  point1: number,
  point2: number,
  pow: number = 2,
): number {
  return Math.pow(point1, pow) + Math.pow(point2, pow);
}

export function euclideanDistance(
  point1: number,
  point2: number,
  point3?: number,
): number {
  return Math.pow(distance(point1, point2) + (point3 ? point3 ** 2 : 0), 0.5);
}

export function manhettanDistance(point1: number, point2: number): number {
  return Math.pow(distance(point1, point2, 1), 0.5);
}
