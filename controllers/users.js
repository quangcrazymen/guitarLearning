const User=require('../models/user')
module.exports.renderRegisterForm=(req,res)=>{
    res.render('users/register')
}

module.exports.createUser=async (req,res,next)=>{
    try{
        const {username,password,email}=req.body
        const newUser=new User({email,username})
        const registeredUser=await User.register(newUser,password)
        //automatically logged in after register
        req.login(registeredUser,err=>{
            if(err) return next(err)
            req.flash('success','Welcome to Yelp-camp')
            res.redirect('/campgrounds')
        })
        
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }  
}
module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login')
}

module.exports.login=(req,res)=>{
    req.flash('success','Welcome back')
    const redirectUrl=req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout=(req,res)=>{
    req.logout()
    req.flash('success','Goodbye!!')
    res.redirect('/campgrounds')
}