import { Message } from "node-nats-streaming";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@aatickets/common";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);

	// Create a fake data event
	const data: OrderCreatedEvent["data"] = {
		id: mongoose.Types.ObjectId().toHexString(),
		version: 0,
		expiresAt: "asdasd",
		userId: "asdasda",
		status: OrderStatus.Create,
		ticket: {
			id: "asdada",
			price: 10,
		},
	};

	// create a fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg };
};

it("replicates the order info", async () => {
	const { listener, data, msg } = await setup();

	// call the onMessage function with the data object + message object
	await listener.onMessage(data, msg);

	const order = await Order.findById(data.id);

	expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
	const { listener, data, msg } = await setup();

	// call the onMessage function with the data object + message object
	await listener.onMessage(data, msg);

	// write assertions
	expect(msg.ack).toHaveBeenCalled();
});
