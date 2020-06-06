import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
	const ticketList = tickets.map((ticket) => {
		return (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}</td>
				<td>
					<Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
						<a className="">View</a>
					</Link>
				</td>
			</tr>
		);
	});

	return (
		<div>
			<h1>Tickets</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
						<th>Link</th>
					</tr>
				</thead>
				<tbody>{ticketList}</tbody>
			</table>
		</div>
	);
};

// if we have to do any server side fetching we have to do it in getInitialProps
// Once the app is rendered and returned we then don't rely on getinitialProps anymore
LandingPage.getInitialProps = async (context, client, currentUser) => {
	const { data } = await client.get("/api/tickets");
	return { tickets: data };
};

export default LandingPage;
