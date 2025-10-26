
exports.retrieveToken = (authHeader) => {
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    return (token)
}
