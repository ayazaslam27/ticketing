import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface ExpirationCompleteEvent {
	subject: Subjects.ExpirationComplete;
	data: {
		orderId: string;
	};
}
