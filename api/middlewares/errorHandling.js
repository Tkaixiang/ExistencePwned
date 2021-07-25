const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response) => {
    if (error.name === 'CastError') {
        return response.status(400).send({success: false, error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({success: false, error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            success: false,
            error: 'invalid-token'
        })
    }

    next(error)
}

module.exports = {unknownEndpoint, errorHandler}