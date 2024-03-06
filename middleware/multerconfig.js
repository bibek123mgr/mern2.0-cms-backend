const multer  = require('multer')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        const allowedfileType=['image/jpg','image/jpeg','image/png'];
        if(!allowedfileType.includes(file.mimetype)){
            cb(new error('this file type is not supported'))
        }
        cb(null,'./storage')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    }
})

module.exports={
    storage,
    multer
}