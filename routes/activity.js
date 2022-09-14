'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
let axios = require("axios");
const { Console } = require('console');

// Global Variables
// const tokenURL = `${process.env.authenticationUrl}/v2/token`;


exports.logExecuteData = [];
function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.hostname,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("================================");
    // console.log("body: " + util.inspect(req.body));
    console.log("headers: " + JSON.stringify(req.headers));
    console.log("trailers: " + JSON.stringify(req.trailers));
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + JSON.stringify(req.route));
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.hostname);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.status(200).send("Save");
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
    console.log("================Execute================");
    console.log(util.inspect(req.body));
    JWT(req.body, process.env.JWT_TOKEN, (err, decoded) => {
        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            // console.log('##### decoded ####=>', decoded);
            console.log('##### Campaign Code ####=>', decoded.inArguments[0].campaignCode);
            console.log('##### Mobile Number ####=>', decoded.inArguments[0].mobileNumber);

            if(decoded.inArguments[0].campaignCode && decoded.inArguments[0].mobileNumber){

                axios.post(process.env.IVR_URL, {
                    msisdn: decoded.inArguments[0].mobileNumber,
                    campaignId: decoded.inArguments[0].campaignCode,
                    vendorKey: 'vivaconnectobdapi@197'
                })
                .then(function (response) {
                    console.log("response.status: ",response.status);
                    console.log("response.data: ",response.data);
                    res.status(200).send("Execute");
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(400).send("Execute");
                });
            }else {
                console.error('inArguments invalid.');
                res.status(400).send("Execute");
            }
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }

    });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    //console.log( req.body );
    logData(req);
    res.status(200).send("Publish");
};


/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.status(200).send("Validate");
};


/*
 * POST Handler for /Stop/ route of Activity.
 */
exports.stop = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.status(200).send("Stop");
};


/**
 * This function relies on the env variables to be set
 * 
 * This function invokes the enhanced package authentication. 
 * This would return a access token that can be used to call additional Marketing Cloud APIs
 * 
 */
/*function retrieveToken () {
    axios.post(tokenURL, { // Retrieving of token
        grant_type: 'client_credentials',
        client_id: process.env.clientId,
        client_secret: process.env.clientSecret
    })
    .then(function (response) {
        return response.data['access_token'];
    }).catch(function (error) {
        return error;
    });
}*/