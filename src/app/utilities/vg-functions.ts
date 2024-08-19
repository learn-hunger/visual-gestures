import { INormalizedLandmark, IFingerProps } from "./vg-types-handlandmarks";

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

// Calcuate Weighted Euclidean Distance
export function weightedEuclideanDistance(
  landmark1: INormalizedLandmark,
  landmark2: INormalizedLandmark,
  weights= [1, 1],
): number {
  return  Math.sqrt( weights[0] * Math.pow((landmark1.x-landmark2.x), 2) + weights[1] * Math.pow((landmark1.y-landmark2.y), 2) );
}

// Calculate PiecewiseFingerDistance
export function piecewiseFingerDistance(
fingerProps: IFingerProps,
fingerName: 'INDEX',
weights: [1,1],
): number {
  return weightedEuclideanDistance( fingerProps.data[fingerName].CMC, fingerProps.data[fingerName].MCP, weights= weights )+
         weightedEuclideanDistance( fingerProps.data[fingerName].MCP, fingerProps.data[fingerName].IP, weights= weights)+
         weightedEuclideanDistance( fingerProps.data[fingerName].IP, fingerProps.data[fingerName].TIP, weights= weights);
}