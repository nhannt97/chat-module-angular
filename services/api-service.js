const moduleName = 'apiServiceModule';
const serviceName = 'apiService';
const GET_LIST_USER_OF_PROJECT = 'http://login.sflow.me/user/list';


angular.module(moduleName, []).service(serviceName, function ($http, Upload) {
    const GET_CONVERSATION =  BASE_URL + '/api/conversation';
    const POST_MESSAGE =  BASE_URL + '/api/message/new';
    const SEEN_MESSAGE = BASE_URL + '/api/seenMessage';
    const UPLOAD =  BASE_URL + '/api/upload';
    const GET_USER =  BASE_URL + '/getUser';
    console.log(BASE_URL);
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
            if(__toastr) __toastr.error(response);
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
    this.seenMessage = (data, token, cb) =>{
        doPost(SEEN_MESSAGE, token, data, cb);
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
    this.url = BASE_URL;
    return this;
});
module.exports.name = moduleName;