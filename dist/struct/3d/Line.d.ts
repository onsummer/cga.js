import { Vec3 } from "../../math/Vec3";
import { DistanceResult } from '../../alg/result';
import { Segment } from './Segment';
import { Ray } from './Ray';
import { Triangle } from './Triangle';
import { Polyline } from "./Polyline";
import { Point } from "./Point";
import { Orientation } from "../data/type";
export declare class Line {
    origin: Vec3;
    end: Vec3;
    direction: Vec3;
    constructor(origin?: Vec3, end?: Vec3);
    distancePoint(pt: Vec3): DistanceResult;
    distanceSegment(segment: Segment): DistanceResult;
    /**
     * 直线到直线的距离
     * 参数与最近点顺序一致
     * @param  {Line} line
     */
    distanceLine(line: Line): DistanceResult;
    /**
     * 直线与射线的距离
     * @param {Ray} ray
     */
    distanceRay(ray: Ray): DistanceResult;
    /**
     *
     * @param triangle
     */
    distanceTriangle(triangle: Triangle): DistanceResult;
    distancePolyline(polyline: Polyline | Vec3[]): DistanceResult;
    orientationPoint(point: Point, normal?: Vec3): Orientation.Common | Orientation.Positive | Orientation.Negative;
}
export declare function line(start?: Vec3, end?: Vec3): Line;
