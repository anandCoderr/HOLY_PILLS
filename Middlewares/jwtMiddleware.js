
import jwt from 'jsonwebtoken';

import {errorHelper} from '../Helper/globalHelper.js'

const userAuthMiddleware=(req, res, next)=>{
    
        const token = req.headers['authorization'];

        // console.log("Request header ==> ",req.headers);

        try{

            if(!token){
                return (errorHelper(res,{message:"Not Authenticated", status:401}));
            }
            
            const jwtPrivateKey=process.env.SECREAT_KEY;


            // console.log("Your Jwt token:- ",token);
            // console.log("Your Jwt token:- ",token.replace('Bearer ', ''));

            

            
        jwt.verify(token.replace('Bearer ', ''), jwtPrivateKey, async(err, decoded) => {
            if (err) {
                return (errorHelper(res,{message:"Invalid token", status:403}));
            }


            req.userId = decoded.userId;
            req.userCountry = decoded.userCountry;
            next();
        });
    
    }
    catch(err){
        return errorHelper(res,err);
    }
        
}

export default userAuthMiddleware