import { Publisher, Subjects, PaymentCreatedEvent } from "@aatickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
