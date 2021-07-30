const BaseJoi=require('joi')
const sanitizeHtml=require('sanitize-html')

const extention=(joi)=>(
    {
        type:'string',
        base:joi.string(),
        messages:{
            'string.escapedHTML':'{{#label}} must not include HTML'
        },
        rules:{
            escapeHTML:{
                validate(value,helpers){
                    const clean=sanitizeHtml(value,{
                        allowedTags:[],
                        allowedAttributes:{},
                    })
                    if(clean!==value)return helpers.error('string.escapedHTML',{value})
                    return clean
                }
            }
        }
    }
)

const Joi=BaseJoi.extend(extention)

module.exports.campgroundSchema=Joi.object({
    campground:Joi.object({
        title:Joi.string().required().escapeHTML(),
        location:Joi.string().required().escapeHTML(),
        price:Joi.number().required().min(0),
        description:Joi.string().required().escapeHTML()
        //image:Joi.string().required()
    }).required(),
    deleteImages:Joi.array()
})

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        body:Joi.string().required().escapeHTML(),
        rating:Joi.number().required().min(1).max(5)
    }).required()
})