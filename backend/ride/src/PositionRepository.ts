import { Position, PrismaClient } from "@prisma/client";

export default class PositionRepository {
    private prismaClient: PrismaClient

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async getByRideId(rideId: string) {
        return await this.prismaClient.position.findMany({ where: { rideId } });
    }

    async getById(positionId: string) {
        return await this.prismaClient.position.findFirstOrThrow({ where: { positionId } });
    }

    async add(position: Position) {
        await this.prismaClient.position.create({ data: { ...position } });
    }
}