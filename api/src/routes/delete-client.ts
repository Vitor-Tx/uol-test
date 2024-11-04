import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request.js";

export async function deleteClient(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete("/clients/:id", {
      schema: {
        summary: 'Delete a client',
        tags: ['clients'],
        params: z.object({
          id: z.string().transform(Number),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    }, async (request, reply) => {
      const { id } = request.params;
      const client = await prisma.client.findUnique({
        where: { id },
      });

      if (client === null) {
        throw new BadRequest('Client not found.')
      };

      await prisma.client.delete({
        where: { id },
      });

      return reply.status(200).send({ message: "Cliente excluído com sucesso." });
    });
}
