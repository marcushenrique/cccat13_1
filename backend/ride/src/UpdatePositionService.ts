import crypto from "crypto";
import PositionRepository from "./PositionRepository";
import RideRepository from "./RideRepository";

export default class UpdatePositionService {

    constructor(readonly rideRepository: RideRepository, readonly positionRepository: PositionRepository) {
    }

    async updatePosition(input: any) {
        const ride = await this.rideRepository.getRide(input.rideId);
        if (ride.status !== "in_progress") {
            throw new Error("Ride is not in progress");
        }
        const position = {
            positionId: crypto.randomUUID(),
            rideId: input.rideId,
            lat: input.lat,
            long: input.long,
            date: new Date()
        };
        await this.positionRepository.addPosition(position);
        return position.positionId;
    }
}