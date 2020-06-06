import {
	Publisher,
	Subjects,
	ExpirationCompleteEvent,
} from "@aatickets/common";

export class ExpirationCompletePublisher extends Publisher<
	ExpirationCompleteEvent
> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
