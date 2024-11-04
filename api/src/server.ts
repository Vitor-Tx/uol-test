import fastify from "fastify";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform, ZodTypeProvider } from 'fastify-type-provider-zod';
import { createClient } from "./routes/create-client.js";
import { getClient } from "./routes/get-client.js";
import { getAllClients } from "./routes/get-all-clients.js";
import { updateClient } from "./routes/update-client.js";
import { deleteClient } from "./routes/delete-client.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { errorHandler } from "./error-handler.js";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'uol.test',
      description: 'Especificações da API para o back-end da aplicação construída para o teste técnico full stack uol.',
      version: '1.0.0'
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createClient);
app.register(getClient);
app.register(getAllClients);
app.register(updateClient);
app.register(deleteClient);

app.setErrorHandler(errorHandler)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!')
})
