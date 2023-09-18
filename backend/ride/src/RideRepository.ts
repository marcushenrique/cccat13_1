import { PrismaClient, Ride } from "@prisma/client";
import { AccountType } from "./types";

export default class RideRepository {
    private prismaClient: PrismaClient

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async getById(rideId: string) {
        return await this.prismaClient.ride.findUniqueOrThrow({ where: { rideId } });
    }

    async getLastByAccountIdAndType(accountId: string, accountType: AccountType) {
        return await this.prismaClient.ride.findFirst({
            where: { [`${accountType}Id`]: accountId },
            orderBy: { date: "desc" },
        });
    }

    async add(ride: Ride) {
        await this.prismaClient.ride.create({ data: { ...ride } });
    }

    async update(ride: Ride) {
        await this.prismaClient.ride.update({ where: { rideId: ride.rideId }, data: { ...ride } })
    }
}