const vision = require('microsoft-computer-vision')

function seeImageUrl(url, callback) {
    vision.analyzeImage({
            "Ocp-Apim-Subscription-Key": process.env.OCP_KEY,
            "request-origin":"westus",
            "visual-features":"ImageType, Categories, Tags, Faces, Description, Color, Adult",
            "details" : "Celebrities, Landmarks",
            "content-type": "application/json",
            "url": url //or "body": "image_binary"
            }).then((result)=>{
                callback(null, result)
            }).catch((err)=>{
                callback(err)
            })
}

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.', req.query);
    const { url } = req.query;
    if (url) {
        seeImageUrl(url, function(err, data) {
            const errorMsg = `${url} , Error:${err}`;
            const bodyJson = { url, data }
            context.res = {
                headers: {'Content-Type': 'application/json'},
                body: bodyJson
            };

          if (err) {
            context.res.body = errorMsg;
          }

          context.done(err, bodyJson)
        })
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a url= in the query string"
        };
        context.done();
    }
};
