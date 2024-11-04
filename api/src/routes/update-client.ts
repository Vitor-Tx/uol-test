import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request.js";

export async function updateClient(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put("/clients/:id", {
      schema: {
        summary: 'Update a client',
        tags: ['clients'],
        params: z.object({
          id: z.string().transform(Number),
        }),
        body: z.object({
          name: z.string(),
          email: z.string(),
          cpf: z.string(),
          phone: z.string(),
          status: z.enum(["Ativo", "Inativo", "Aguardando ativação", "Desativado"]),
        }),
        response: {
          200: z.object({
            clientId: z.string(),
          }),
        },
      },
    }, async (request, reply) => {
      const { id } = request.params;
      const {
        name,
        email,
        cpf,
        phone,
        status
      } = request.body;

      const client = await prisma.client.update({
        where: { id },
        data: {
          name,
          email,
          cpf,
          phone,
          status
        }
      });

      if (client === null) {
        throw new BadRequest('Cliente não encontrado.')
      };

      return reply.status(200).send({ clientId: String(client.id) });
    });
}
