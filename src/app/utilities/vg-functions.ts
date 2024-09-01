import {
  IFingerKeypoints,
  INormalizedLandmark,
  TFingersData,
} from "./vg-types-handlandmarks";
import { VgHandLandmarksDTO } from "../pointer/DTO/vg-handlandmark";
import { EFingers } from "./vg-constants";

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
  weights: number[] = [1, 1],
): number {
  return Math.sqrt(
    weights[0] * Math.pow(landmark1.x - landmark2.x, 2) +
      weights[1] * Math.pow(landmark1.y - landmark2.y, 2),
  );
}

// Calculate PiecewiseFingerDistance
export function piecewiseFingerDistance(
  fingerData: Omit<TFingersData, "WRIST">,
  fingerName: Exclude<keyof typeof EFingers, "WRIST">,
  weights: number[] = [1, 1],
): number {
  return (
    weightedEuclideanDistance(
      fingerData[fingerName].MCP,
      fingerData[fingerName].PIP,
      (weights = weights),
    ) +
    weightedEuclideanDistance(
      fingerData[fingerName].PIP,
      fingerData[fingerName].DIP,
      (weights = weights),
    ) +
    weightedEuclideanDistance(
      fingerData[fingerName].DIP,
      fingerData[fingerName].TIP,
      (weights = weights),
    )
  );
}
