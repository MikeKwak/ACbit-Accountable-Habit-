const checkLoggedIn = (req, res, next) => {
    const { user } = res.locals;
    if(!user){
        res.sendStatus(401) //unauthorized
        return
    }
    return next()
}

export default checkLoggedIn;