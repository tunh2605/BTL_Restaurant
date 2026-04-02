import mongoose from "mongoose";

const HTTP_STATUS = {
	BAD_REQUEST: 400,
	INTERNAL_ERROR: 500,
} 

const ERROR_MESSAGES = {
	INVALID_JSON: "Invalid JSON syntax",
	INTERNAL_SERVER_ERROR: "Internal Server Error",
} 



const createErrorResponse = (message) => ({
	error: message,
});

const handleOperationalError = (
	res,
	statusCode,
	message,
) => {
	res.status(statusCode).json(createErrorResponse(message));
};

export function errorMiddleware(
	err,
	_req,
	res,
	_next
) {
	console.error("[Error Middleware]", err);

	// Mongoose validation errors
	if (err instanceof mongoose.Error.ValidationError) {
		handleOperationalError(res, HTTP_STATUS.BAD_REQUEST, err.message);
		return;
	}

	if (err instanceof mongoose.Error.CastError) {
		handleOperationalError(res, HTTP_STATUS.BAD_REQUEST, "Invalid ID format");
		return;
	}

	// Programming errors - unexpected errors
	if (err instanceof TypeError) {
		handleOperationalError(res, HTTP_STATUS.BAD_REQUEST, err.message);
		return;
	}

	if (err instanceof SyntaxError) {
		handleOperationalError(
			res,
			HTTP_STATUS.BAD_REQUEST,
			ERROR_MESSAGES.INVALID_JSON,
		);
		return;
	}

	// Default - internal server error
	handleOperationalError(
		res,
		HTTP_STATUS.INTERNAL_ERROR,
		ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
	);
}