import { Publisher, Subjects, OrderCreatedEvent } from "@aatickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
