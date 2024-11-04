import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request.js"

export async function createClient(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/clients", {
      schema: {
        summary: 'Create a client',
        tags: ['clients'],
        body: z.object({
          name: z.string(),
          email: z.string(),
          cpf: z.string(),
          phone: z.string(),
          status: z.enum(["Ativo", "Inativo", "Aguardando ativação", "Desativado"]),
        }),
        response: {
          201: z.object({
            clientId: z.string(),
          }),
        }
      },

    }, async (request, reply) => {

      const {
        name,
        email,
        cpf,
        phone,
        status
      } = request.body;

      const clientWithSameCpf = await prisma.client.findUnique({
        where: {
          cpf,
        }
      })

      const clientWithSameEmail = await prisma.client.findUnique({
        where: {
          email,
        }
      })

      const clientWithSamePhone = await prisma.client.findUnique({
        where: {
          phone,
        }
      })

      if (clientWithSameCpf !== null) {
        throw new BadRequest('Outro cliente com o mesmo cpf já existe.')
      }

      if (clientWithSameEmail !== null) {
        throw new BadRequest('Outro cliente com o mesmo email já existe.')
      }

      if (clientWithSamePhone !== null) {
        throw new BadRequest('Outro cliente com o mesmo número de telefone já existe.')
      }

      const client = await prisma.client.create({
        data: {
          name,
          email,
          cpf,
          phone,
          status
        }
      });

      return reply.status(201).send({ clientId: String(client.id) });
    })
}

