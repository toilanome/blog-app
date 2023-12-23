import jwt  from "jsonwebtoken";


export const verifyAccessToken = async (req,res,next) =>{
    if(req?.headers?.authorization?.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.SECRET_KEY, (error, decode) =>{
            if(error) {
                return res.status(401).json({
                    success : false,
                    message: "Invalid access token "
                })

            }
            console.log("decode là", decode);
            req.user = decode
            next()
        })
    }else{
        return res.status(401).json({
            success: false,
            message: "Required authen"
        })
    }
}