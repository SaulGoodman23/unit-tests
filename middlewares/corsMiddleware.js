// Handling cors and preflight requests
export const cors = (req, res, next) => {
    const whiteList = ['localhost:3000', 'localhost:4000']
    const origin=req.headers.host
    if(!whiteList.includes(origin)){
        return res.status(403).json({error:"Not Allowed(CORS)"})
    }

    // handle preflight requests(options method)
    if(req.method==="OPTIONS" && whiteList.includes(req.headers.host)){
        res.set("Access-Control-Allow-Origin",req.headers.host)
        res.set("Access-Control-Allow-Methods",req.headers['access-control-request-method'])
        res.set("Access-Control-Max-Age","86400")
        res.set("Connection","keep-alive")
        res.status(204)
        return next()
    }
    next()
}