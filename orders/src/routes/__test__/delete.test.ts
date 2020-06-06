import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@aatickets/common";
import { natsWrapper } from "../../nats-wrapper"; // Will automatically be mocked out
import mongoose from "mongoose";

it("marks the order as cancelled", async () => {
	// Create a ticket
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
		id: mongoose.Types.ObjectId().toHexString(),
	});

	await ticket.save();

	const user = global.signin();

	// Make a request to build an order with this ticket
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ ticketId: ticket.id })
		.expect(201);

	// Make request to cancel the order
	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(204);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
	// Create a ticket
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
		id: mongoose.Types.ObjectId().toHexString(),
	});

	await ticket.save();

	const user = global.signin();

	// Make a request to build an order with this ticket
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({
			ticketId: ticket.id,
		})
		.expect(201);

	// Make request to cancel the order
	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(204);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
