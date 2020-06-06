import { Message } from "node-nats-streaming";
import { TicketUpdatedListener } from "../ticket-update-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@aatickets/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
	// Create an instance of the listener
	const listener = new TicketUpdatedListener(natsWrapper.client);

	//Create and save ticket
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
		id: mongoose.Types.ObjectId().toHexString(),
	});

	await ticket.save();

	// Create a fake data event
	const data: TicketUpdatedEvent["data"] = {
		version: ticket.version + 1,
		id: ticket.id,
		title: "new concert",
		price: 999,
		userId: new mongoose.Types.ObjectId().toHexString(),
	};

	// create a fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, ticket };
};

it("finds, updates and saves a ticket", async () => {
	const { listener, data, msg, ticket } = await setup();

	// call the onMessage function with the data object + message object
	await listener.onMessage(data, msg);

	// write assertions to make sure a ticket is created
	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.title).toEqual(data.title);
	expect(updatedTicket!.price).toEqual(data.price);
	expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
	const { listener, data, msg, ticket } = await setup();

	// call the onMessage function with the data object + message object
	await listener.onMessage(data, msg);

	// write assertions
	expect(msg.ack).toHaveBeenCalled();
});

it("does not call if the event has a skipped version", async () => {
	const { msg, data, listener, ticket } = await setup();

	data.version = 10;
	try {
		await listener.onMessage(data, msg);
	} catch (error) {}

	expect(msg.ack).not.toHaveBeenCalled();
});
