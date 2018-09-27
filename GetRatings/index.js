module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try {
        if (req.query.userId) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: context.bindings.userRatings
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a user ID on the query string or in the request body"
        };
    }
    } catch(err) {
        context.log(err)
    }
    
    context.done();
};