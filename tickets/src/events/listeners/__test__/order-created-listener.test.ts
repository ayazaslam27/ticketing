import { Message } from "node-nats-streaming";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, Subjects, OrderStatus } from "@aatickets/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
	// Create an instance of the listener
	const listener = new OrderCreatedListener(natsWrapper.client);

	// Create and save ticket

	const ticket = Ticket.build({
		title: "concert",
		price: 999,
		userId: mongoose.Types.ObjectId().toHexString(),
	});

	await ticket.save();

	// Create a fake data event
	const data: OrderCreatedEvent["data"] = {
		id: mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Create,
		userId: mongoose.Types.ObjectId().toHexString(),
		expiresAt: "",
		ticket: {
			id: ticket.id,
			price: ticket.price,
		},
	};

	// create a fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, ticket };
};

it("sets the userId of the ticket", async () => {
	const { listener, ticket, data, msg } = await setup();

	// call the onMessage function with the data object + message object
	await listener.onMessage(data, msg);

	// write assertions to make sure a ticket is created
	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
	const { listener, data, msg } = await setup();

	// call the onMessage function with the data object + message object
	await listener.onMessage(data, msg);

	// write assertions
	expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
	const { listener, ticket, data, msg } = await setup();

	// call the onMessage function with the data object + message object
	await listener.onMessage(data, msg);

	// write assertions
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
