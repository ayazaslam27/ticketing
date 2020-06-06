// Will automatically be mocked out upon reference

export const natsWrapper = {
	client: {
		publish: jest
			.fn()
			.mockImplementation(
				(subject: string, data: string, callback: () => void) => {
					callback();
				}
			),
	},
};
