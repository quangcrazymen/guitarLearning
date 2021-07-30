const Campground=require('../models/campground')
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken=process.env.MAPBOX_TOKEN
const geocoder=mbxGeocoding({accessToken:mapBoxToken})
const {cloudinary}=require('../cloudinary')
module.exports.index=async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new')
    //console.log(isLoggedIn)
}

module.exports.createCampground=async (req,res,next)=>{
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const campground=new Campground(req.body.campground)
    campground.geometry=geoData.body.features[0].geometry
    campground.images=req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.author=req.user._id
    await campground.save();
    console.log(campground)
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground=async(req,res)=>{
    const {id}=req.params;
    const campground=await (await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author'));
    //console.log(campground)
    if(!campground){
        req.flash('error','Cannot find campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}

module.exports.renderEditForm=async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}

module.exports.updateCampground=async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that!!')
        return res.redirect(`/campgrounds/${id}`)
    }
    console.log(req.body)
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
    //console.log(imgs)
    campground.images.push(...imgs)
    const test=await campground.save()
    //console.log(test)
    const camp=await Campground.findByIdAndUpdate(id,{...req.body.campground})
    //console.log(camp)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
        console.log(campground)
    }
    req.flash('success','Successfully update a campground')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground=async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully delete a campground!')
    res.redirect('/campgrounds')
}