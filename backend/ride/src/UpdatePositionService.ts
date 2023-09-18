import crypto from "crypto";
import PositionRepository from "./PositionRepository";
import RideRepository from "./RideRepository";

export default class UpdatePositionService {

    constructor(private readonly rideRepository: RideRepository, private readonly positionRepository: PositionRepository) {
    }

    async updatePosition(input: any) {
        const ride = await this.rideRepository.getById(input.rideId);
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
        await this.positionRepository.add(position);
    }
}