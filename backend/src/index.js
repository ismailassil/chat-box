import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import fastifyCors from "@fastify/cors";
import { randomUUID } from "crypto";

const fastify = Fastify({
	logger: {
		transport: {
			target: "pino-pretty",
		},
	},
});

fastify.register(fastifyCors, {
	origin: "http://localhost:5173",
});
const clients = new Map();

fastify.register(fastifyWebsocket);

fastify.register((fastify) => {
	fastify.get("/chat", { websocket: true }, (socket, req) => {
		const clientId = randomUUID();

		clients.set(clientId, socket);
		socket.send(
			JSON.stringify({
				event: "welcome",
				id: clientId,
				message: "Welcome to the chat!",
			})
		);

		socket.on("message", (message) => {
			const parsed = JSON.parse(message.toString());
			const toClient = clients.get(parsed.to);
			if (!toClient) {
				console.log("Client Not Found");
				return;
			}
			switch (parsed.event) {
				case "private-message":
					toClient.send(
						JSON.stringify({
							event: "private-message",
							from: clientId,
							sender: parsed.sender,
							time: parsed.time,
							message: parsed.message,
						})
					);
					break;
				case "typing":
					toClient.send(
						JSON.stringify({
							event: "typing",
							sender: parsed.sender,
						})
					);
					break;
				case "start-call":
					toClient.send(
						JSON.stringify({
							event: "receive-call",
							sender: parsed.sender,
							senderId: parsed.message,
							from: clientId,
						})
					);
					break;
				case "close-connection":
					toClient.send(
						JSON.stringify({
							event: "close-connection",
							sender: parsed.from,
						})
					);
			}
		});

		socket.on("close", () => {
			clients.delete(clientId);
		});
	});
});

fastify.listen({ host: "::", port: 3000 });
