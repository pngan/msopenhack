module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log(req.query.ratingId);
    context.log(context.bindings.ratingIdInput);

    if (req.query.ratingId || (req.body && req.body.ratingId)) {
        context.res = {
            status: 200, /* Defaults to 200 */
            body: context.bindings.ratingIdInput
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    context.done();
};