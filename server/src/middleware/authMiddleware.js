import jwt from "jsonwebtoken";

export const protect = (req,res,next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader?.startsWith("Bearer "))return res.status(401).json({message:"Unauthorized"});

  const token = authHeader.split(" ")[1];

  jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
    if(err) return res.status(403).json({message:"Token expired"});
    req.userId = decoded.id;
    next();
  });
};
