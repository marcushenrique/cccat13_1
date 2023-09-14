import { Position, Prisma, PrismaClient } from "@prisma/client";

export default class PositionRepository {
    prismaClient: PrismaClient

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async getPosition(positionId: string) {
        return await this.prismaClient.position.findFirstOrThrow({
            where: { positionId }
        })
    }

    async addPosition(position: Position) {
        await this.prismaClient.position.create({
            data: {
                positionId: position.positionId,
                rideId: position.rideId,
                lat: new Prisma.Decimal(position.lat),
                long: new Prisma.Decimal(position.long),
                date: position.date
            }
        });
    }
}