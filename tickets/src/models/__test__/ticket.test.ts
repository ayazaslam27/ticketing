import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async (done) => {
	// Create an instance of a ticker

	const ticket = Ticket.build({
		title: "concert",
		price: 20,
		userId: "123",
	});

	// Save the ticket to the db
	await ticket.save();

	// Fetch the ticket twice
	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	// Make two seperate changes to the tickets we fetched
	firstInstance?.set({ price: 10 });
	secondInstance?.set({ price: 15 });

	// Save the first fetched ticket
	await firstInstance!.save();

	// Save te second fetched ticket and expect an error
	try {
		await secondInstance!.save();
	} catch (error) {
		return done();
	}

	throw new Error("Should not reach this point");
});

it("increments the version on mutliple saves", async () => {
	// Create an instance of a ticker

	const ticket = Ticket.build({
		title: "concert",
		price: 20,
		userId: "123",
	});

	// Save the ticket to the db
	await ticket.save();
	expect(ticket.version).toEqual(0);

	await ticket.save();
	expect(ticket.version).toEqual(1);

	await ticket.save();
	expect(ticket.version).toEqual(2);
});
