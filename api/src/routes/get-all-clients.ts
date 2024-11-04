import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { FastifyInstance } from "fastify";

export async function getAllClients(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/clients", {
      schema: {
        summary: 'Get all clients',
        tags: ['clients'],
        querystring: z.object({
          pageIndex: z.string().nullish().default('0').transform(Number),
        }),
        response: {
          200: z.object({
            clients: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string(),
                cpf: z.string(),
                phone: z.string(),
                createdAt: z.date(),
                status: z.string(),
              }),

            ),
            total: z.number(),
          }),
        },
      },
    }, async (request, reply) => {
      const { pageIndex } = request.query;
      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            cpf: true,
            phone: true,
            createdAt: true,
            status: true,
          },
          take: 10,
          skip: pageIndex * 10,
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.client.count()
      ])
      return reply.status(200).send({
        clients: clients.map(client => {
          return {
            id: client.id,
            name: client.name,
            email: client.email,
            cpf: client.cpf,
            phone: client.phone,
            createdAt: client.createdAt,
            status: client.status,
          }
        }),
        total,
      })
    });
}
