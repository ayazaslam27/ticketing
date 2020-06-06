import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@aatickets/common";

interface PaymentAttrs {
	stripeId: string;
	orderId: string;
}

interface PaymentDoc extends mongoose.Document {
	stripeId: string;
	orderId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
	build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
	{
		orderId: {
			type: String,
			required: true,
		},
		stripeId: {
			type: String,
			required: true,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
	return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
	"Payment",
	paymentSchema
);

export { Payment };
