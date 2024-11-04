import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request.js";

export async function getClient(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/clients/:id", {
      schema: {
        summary: 'Get a client',
        tags: ['clients'],
        params: z.object({
          id: z.string().transform(Number),
        }),
        response: {
          200: z.object({
            id: z.number(),
            name: z.string(),
            email: z.string(),
            cpf: z.string(),
            phone: z.string(),
            createdAt: z.date(),
            status: z.string(),
          }),
        },
      },
    }, async (request, reply) => {
      const { id } = request.params;
      console.log(request.params)

      const client = await prisma.client.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          phone: true,
          createdAt: true,
          status: true,
        },
        where: { id },
      });


      console.log(client)


      if (client === null) {
        throw new BadRequest('Cliente não encontrado.')
      };

      return reply.send({
        id: client.id,
        name: client.name,
        email: client.email,
        cpf: client.cpf,
        phone: client.phone,
        createdAt: client.createdAt,
        status: client.status,
      });
    });
}
