import { Position } from "@prisma/client";
import Coord from "./Coord";
import DistanceCalculator from "./DistanceCalculator";
import PositionRepository from "./PositionRepository";
import RideRepository from "./RideRepository";

const FARE_FACTOR = 2.1;

export default class FinishRideService {

    constructor(private readonly rideRepository: RideRepository, private readonly positionRepository: PositionRepository) {
    }

    async finishRide(rideId: string) {
        const ride = await this.rideRepository.getById(rideId);
        if (ride.status !== "in_progress") {
            throw new Error("Ride is not in progress");
        }
        const positions = await this.positionRepository.getByRideId(rideId);
        ride.distance = this.calculateTotalDistance(positions);
        ride.fare = this.calculateFare(ride.distance);
        ride.status = "completed";
        await this.rideRepository.update(ride);
    }

    private calculateTotalDistance(positions: Position[]) {
        const [head, ...tail] = positions;
        const totalDistance = this.calculateDistance(head, tail, 0);
        return Number(totalDistance.toFixed(1));
    }

    private calculateDistance(current: Position, remaining: Position[], distanceAcc: number): number {
        if (remaining.length === 0) {
            return distanceAcc;
        }
        const [reaminingHead, ...remainingTail] = remaining;
        const currentCoord = new Coord(current.lat, current.long);
        const remainingHeadCoord = new Coord(reaminingHead.lat, reaminingHead.long);
        const distance = DistanceCalculator.calculate(currentCoord, remainingHeadCoord);
        return this.calculateDistance(reaminingHead, remainingTail, distanceAcc + distance);
    }

    private calculateFare(distance: number) {
        const fare = distance * FARE_FACTOR;
        return Number(fare.toFixed(2));
    }
}