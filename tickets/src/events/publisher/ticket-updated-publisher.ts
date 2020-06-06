import { Publisher, Subjects, TicketUpdatedEvent } from "@aatickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicektUpdated = Subjects.TicektUpdated;
}
