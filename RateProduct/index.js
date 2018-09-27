const uuidv1 = require('uuid/v1');
const rp = require('request-promise');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    /*
{
    "userId": "cc20a6fb-a91f-4192-874d-132493685376",
    "productId": "4c25613a-a3c2-4ef3-8e02-9c335eb23204",
    "locationName": "Sample ice cream shop",
    "rating": 5,
    "userNotes": "I love the subtle notes of orange in this ice cream!"
}
    */

    const requestData = req.body;
    let userData,
        productData,
        id = uuidv1();
    
    if(!isValidRating(requestData.rating)){
        invalidRequest(context, `${requestData.rating} is invalid. Must be between 0 and 5`);
        context.done();
    }



    rp({
            uri: `https://serverlessohuser.trafficmanager.net/api/GetUser?userId=${requestData.userId}`,
            json: true
        })
        .then(data => {
            context.log('setting user data');
            userData = data;

            rp({
                    uri: `https://serverlessohproduct.trafficmanager.net/api/GetProduct?productId=${requestData.productId}`,
                    json: true
                })
                .then(data => {
                    context.log('setting product data');
                    productData = data;


                    context.log('building response');
                    context.log(requestData);

                    try{
                    var response = {
                        "userId": requestData.userId,
                        "productId": requestData.productId,
                        "locationName": requestData.locationName,
                        "rating": requestData.rating,
                        "userNotes": requestData.userNotes,
                        "id" : id,
                        "timestamp": new Date()
                    };
                    }
                    catch(err){
                        context.log(err);
                    }

                    context.log('Response coming...')
                    context.log(response);


                    context.log('saving to cosmos');
                    context.bindings.outputDocument = response;

                    context.log('about to return http response');
                    context.res = {
                        // status: 200, /* Defaults to 200 */
                        body: response
                    };

                    context.done();
        
                }, data => {
                    invalidRequest(context, `${requestData.productId} is an invalid Product`);
                    context.done();
                })

        }, data => {
            invalidRequest(context, `${requestData.userId} is an invalid User`);
            context.done();
        })
};

function isValidRating(rating){
    return !(rating < 0 || rating > 5);
}

function invalidRequest(context, error){
    context.log(error);
    context.res = {
        status: 400,
        body: error
    };

}
