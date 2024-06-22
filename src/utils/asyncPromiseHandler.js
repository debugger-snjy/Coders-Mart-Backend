// Here we have return the function that return the async function with the promise

// --------------------------------------------------------------------------------------------------------------------
// ARROW FUNCTION (RETURN AUTOMATIC)
const asyncPromiseHandler = (requestHandler) =>
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((error) => {
                next(error)
            })
    }

export { asyncPromiseHandler }