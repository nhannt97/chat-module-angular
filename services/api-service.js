const moduleName = 'chatModule';
const serviceName = 'apiService';
const GET_LIST_USER_OF_PROJECT = 'http://login.sflow.me/user/list';
const wiMessengerUrl = 'http://13.251.24.65:5000';
// const wiMessengerUrl = 'http://localhost:5000';

const GET_USER = wiMessengerUrl + '/user';
const CREATE_CONVERSATION = wiMessengerUrl + '/conversation/new';
const GET_CONVERSATION = wiMessengerUrl + '/conversation';
const POST_MESSAGE = wiMessengerUrl + '/message/new';
const UPLOAD = wiMessengerUrl + '/upload';
const DOWNLOAD = wiMessengerUrl + '/download';
angular.module(moduleName).service(serviceName, function ($http, Upload) {
    let doPost = (URL, data, cb) => {
        $http.post(URL, data).then(
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
            }
        );
    };
    this.getUser = (data, cb) => {
        doPost(GET_USER, data, cb);
    }
    this.getConver = (data, cb) => {
        doPost(GET_CONVERSATION, data, cb);
    }
    this.postMessage = (data, cb) => {
        doPost(POST_MESSAGE, data, cb);
    }
    this.upload = (data, cb) => {
        Upload.upload({
            url: UPLOAD,
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
    this.download = (data, cb) => {
        $http.get(DOWNLOAD, data).then(
            (response) => {
                console.log(response);
                cb(response)
            },
            (error) => {
                console.log(error);
                cb();
            }
        )
    }
    this.getListUserOfProject = (data, token, cb) => {
        $http.post(GET_LIST_USER_OF_PROJECT, data, {
            headers: {
                'Authorization': token
            }
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
            }
        );
    }
    return this;
});