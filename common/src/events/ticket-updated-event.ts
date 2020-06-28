import { Subjects } from "./subjects";

export interface TicketUpdatedEvent {
	subject: Subjects.TicektUpdated;
	data: {
		id: string;
		title: string;
		price: number;
		userId: string;
		version: number;
		orderId?: string;
	};
}
