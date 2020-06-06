import axios from "axios";

export default ({ req }) => {
	// To communicate between services running on different namespaces inside kubernetes
	// http://NAMEOFSERVICE.NAMESPACE.svc.cluster.local
	// http://ingress-nginx.ingress-nginx.svc.cluster.local

	// We also need to send cookie
	// headers: req.headers,

	if (typeof window === "undefined") {
		// We are on the server

		return axios.create({
			baseURL:
				"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
			headers: req.headers,
		});
	} else {
		// We are on the browser
		return axios.create({
			baseURL: "/",
		});
	}
};
