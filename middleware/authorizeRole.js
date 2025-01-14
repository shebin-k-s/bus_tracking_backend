export const authorizeRole = (allowedRoles) => (req,res,next) =>{
    if(allowedRoles.includes(req.user.role)){
        return next()
    }
    return res.status(403).json({ message: `Access denied. Insufficient permissions. Only for ${allowedRoles}` });

}