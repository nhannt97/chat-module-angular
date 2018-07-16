const moduleName = 'apiServiceModule';
const serviceName = 'apiService';
const GET_LIST_USER_OF_PROJECT = 'http://login.sflow.me/user/list';
const wiMessengerUrl = 'http://chat.i2g.cloud';

const GET_CONVERSATION = wiMessengerUrl + '/api/conversation';
const POST_MESSAGE = wiMessengerUrl + '/api/message/new';
const UPLOAD = wiMessengerUrl + '/api/upload';
const GET_USER = wiMessengerUrl + '/getUser';
angular.module(moduleName, []).service(serviceName, function ($http, Upload) {
    
    let doPost = function(URL, token, data, cb) {
        $http({
            method: 'POST',
            url: URL,
            headers: {
                'Authorization': token
            },
            data: data
        }).then(function successCallback(response) {
                if (response.data.code != 200) {
                    console.error(response.data.reason);
                    cb();
                } else {
                    cb(response.data.content);
                }
        }, function errorCallback(response) {
            console.error(response);
            if(toastr) toastr.error(response);
            cb();
        });
    }
    
    this.getConver = (data, token, cb) => {
        doPost(GET_CONVERSATION, token, data, cb);
    }
    this.getUser = (data, token, cb) => {
        doPost(GET_USER, token, data, cb);
    }
    this.postMessage = (data, token, cb) => {
        doPost(POST_MESSAGE, token, data, cb);
    }
    this.getListUserOfProject = (data, token, cb) => {
        doPost(GET_LIST_USER_OF_PROJECT, token, data, cb);
    }
    this.upload = (data, token, cb) => {
        Upload.upload({
            url: UPLOAD,
            headers: {
                'Authorization': token
            },
            file: data.file,
            fields: data.fields
        }).then(
            (response) => {
                if (response.data.code != 200) {
                    console.error(response.data.reason);
                    cb();
                } else {
                    cb(response.data.content);
                }
            },
            (error) => {
                console.error(error);
                cb();
            });
    }
    this.url = wiMessengerUrl;
    return this;
});
module.exports.name = moduleName;