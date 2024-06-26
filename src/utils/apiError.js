// API Error Class for Sending Error Response
class APIError {

    // Constructor
    constructor(statusCode = 400, message = "Something Went Wrong", errors = []) {

        // Status Code that we want to set for the Error
        this.statusCode = statusCode;

        // Error message that describes what went wrong
        this.message = message;

        // This is a variable for frontend to check whether the api is hit successfully or not
        this.success = false;

        // An Array that can hold multiple error details
        this.errors = errors;

    }

    // Created the Class Method to Send the Error Response
    send(res) {
        return res
            .status(this.statusCode)
            .json({
                message: this.message,
                success: this.success,
                error: this.errors
            })
    }
}

// Exporting the APIError Class
export { APIError };