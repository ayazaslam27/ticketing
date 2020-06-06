import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@aatickets/common";
import { natsWrapper } from "../../nats-wrapper"; // Will automatically be mocked out

it("returns an error if the ticket doesnot exist", async () => {
	const ticketId = mongoose.Types.ObjectId();
	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({ ticketId })
		.expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
		id: mongoose.Types.ObjectId().toHexString(),
	});

	await ticket.save();

	const order = Order.build({
		ticket,
		userId: "asdasda",
		status: OrderStatus.Create,
		expiresAt: new Date(),
	});

	await order.save();

	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({ ticketId: ticket.id })
		.expect(400);
});

it("reserves a ticket", async () => {
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
		id: mongoose.Types.ObjectId().toHexString(),
	});

	await ticket.save();

	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({ ticketId: ticket.id })
		.expect(201);
});

it("emits an order created event", async () => {
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
		id: mongoose.Types.ObjectId().toHexString(),
	});

	await ticket.save();

	await request(app)
		.post("/api/orders")
		.set("Cookie", global.signin())
		.send({ ticketId: ticket.id })
		.expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
