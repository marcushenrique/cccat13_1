import { PrismaClient, Ride } from "@prisma/client";
import { AccountType } from "./types";

export default class RideRepository {
    prismaClient: PrismaClient

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async getRide(rideId: string) {
        return await this.prismaClient.ride.findUniqueOrThrow({ where: { rideId } });
    }

    async getLastRide(accountId: string, accountType: AccountType) {
        return await this.prismaClient.ride.findFirst({
            where: { [`${accountType}Id`]: accountId },
            orderBy: { date: "desc" },
        });
    }

    async addRide(ride: Ride) {
        await this.prismaClient.ride.create({ data: { ...ride } });
    }

    async updateRide(ride: Ride) {
        await this.prismaClient.ride.update({ where: { rideId: ride.rideId }, data: { ...ride } })
    }
}