const checkLoggedin = (req, res, next) => {
    const { user } = res.locals;
    if(!user){
        res.sendStatus(401)
        return
    }
    console.log("logged in")
    return next()
}

export default checkLoggedin;