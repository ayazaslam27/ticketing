import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
	subject: Subjects.OrderCreated;
	data: {
		userId: string;
		expiresAt: string;
		id: string;
		version: number;
		status: OrderStatus;
		ticket: {
			id: string;
			price: number;
		};
	};
}
