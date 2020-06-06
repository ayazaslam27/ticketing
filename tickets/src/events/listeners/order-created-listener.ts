import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@aatickets/common";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;

	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
		const { id, ticket } = data;

		// Find the ticket that the order is reserving
		const fetchedTicket = await Ticket.findById(ticket.id);

		// If no ticket, throw error
		if (!fetchedTicket) {
			throw new Error("Ticket not found");
		}

		// Mark the ticket as reserved by setting its orderId property
		fetchedTicket.set({ orderId: id });

		// Save the ticket
		await fetchedTicket.save();

		await new TicketUpdatedPublisher(this.client).publish({
			id: fetchedTicket.id,
			version: fetchedTicket.version,
			price: fetchedTicket.price,
			title: fetchedTicket.title,
			userId: fetchedTicket.userId,
			orderId: fetchedTicket.orderId,
		});

		// Ack the message
		msg.ack();
	}
}
