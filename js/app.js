require('../css/style.css');
let async = require('async');
let moduleName = componentName = 'chatModule';
angular.module(moduleName, ['ngFileUpload'])
        .component(componentName, {
                template: require('../index.html'),
                controller: Controller,
                controllerAs: 'cm'
        });
function Controller(apiService, $interval, $timeout, ModalService, $scope, $http, Upload) {
        let self = this;
        this.showChat = false;
        this.show = false;
        
        let token = window.localStorage.token?window.localStorage.token:'';
        let LProject = window.localStorage.LProject?JSON.parse(window.localStorage.LProject):{};
        function getUser() {
                if (token)
                        apiService.getUser({username: window.localStorage.username}, (res) => {
                                if (res) {
                                        self.user = res;
                                }
                        });
        }
        function getListUser() {
                apiService.getListUserOfProject({
                        name: LProject.name,
                        owner: LProject.owner
                }, token, (res) => {
                        if (res)
                                self.listUser = res;
                        else
                                self.listUser = [];
                })
        }
        function getProject() {
                if (LProject.shared) {
                        getListUser();
                        apiService.getConver({
                                name: LProject.name,
                                idUser: [self.user.id]
                        }, (res) => {
                                if(res) {
                                        self.conver = res;
                                        scrollBottom();
                                        self.showChat = true;
                                        console.log(self.showChat);
                                        socket.emit('join-room', {username: self.user.username, idConversation: self.conver.id});
                                }
                                else
                                        self.conver = {};
                        })
                } else {
                        self.showChat = false;
                }

        }
        if(token) {
            apiService.getUser({username: window.localStorage.username}, (res) => {
                if (res) {
                    self.user = res;
                    getProject();
                }
            });
        }
        $interval(function () {
                let newToken = window.localStorage.token;
                if (newToken && newToken != token) {
                        token = newToken;
                        getUser();
                }
                let newLProject = window.localStorage.LProject?JSON.parse(window.localStorage.LProject):{};
                if (((!LProject && newLProject) || (LProject.name!=newLProject.name)) && self.user) {
                        LProject = newLProject;
                        getProject();
                }
        });

        function scrollBottom() {
                $(document).ready(function() {
                        console.log('scroll');
                        var d = $('#list-message');
                        d.scrollTop(d.prop("scrollHeight"));
                })
        }
        $('#text-message').keypress(function (e) {
                if (e.which == 13 && !e.shiftKey) {
                        let content = $('#text-message').val().split('\n').join('<br/>');
                        let message = {
                                content: content,
                                type: 'text',
                                idSender: self.user.id,
                                idConversation: self.conver.id,
                                User: self.user
                        };
                        socket.emit('sendMessage', message);
                        apiService.postMessage(message, function (res) {
                        });
                        e.preventDefault();
                        $('#text-message').val('');
                }
        });
        this.upload = function (files) {
                async.forEachOfSeries(files, (file, i, _done) => {
                        let type = file.type.substring(0, 5);
                        apiService.upload({
                                file: file,
                                fields: {'name': self.conver.name}
                        }, (res) => {
                                let message = {
                                        content: res,
                                        type: type=='image'?'image':'file',
                                        idSender: self.user.id,
                                        idConversation: self.conver.id,
                                        User: self.user
                                }
                                socket.emit('sendMessage', message);
                                apiService.postMessage(message, (res) => {
                                        _done();
                                });
                        })
                }, (err) => {

                });
        }
        this.download = function(path) {
                let p = path.slice(25);
                return 'http://13.251.24.65:5000/download/'+p;
        }
        socket.on('connection', function (data) {
                console.log(data);
        });
        socket.on('sendMessage', function (data) {
                console.log(data);
                self.conver.Messages = self.conver.Messages?self.conver.Messages:[];
                self.conver.Messages.push(data);
                scrollBottom();
        });
        dragChatModule(self);
};
function dragChatModule(cm) {
        let selected = null, x_pos = 0, y_pos = 0, x_elem = 0, y_elem = 0;
        function _drag_init(elem) {
                selected = elem;
                x_elem = x_pos - selected.offsetLeft;
                y_elem = y_pos - selected.offsetTop;
        }
        function _move_elem(e) {
                x_pos = document.all ? window.event.clientX : e.pageX;
                y_pos = document.all ? window.event.clientY : e.pageY;
                if (selected !== null) {
                        selected.style.left = (x_pos - x_elem) + 'px';
                        selected.style.top = (y_pos - y_elem) + 'px';
                        cm.moving = true;
                }
        }
        function _destroy(evt) {
                selected = null;
                cm.moving = false;
        }
        $('#title-bar')[0].onmousedown = function (evt) {
                _drag_init($('#chat-module')[0]);
                return false;
        };
        $('#icon')[0].onmousedown = function (evt) {
                _drag_init($('#chat-module')[0]);
                return false;
        };
        document.onmousemove = _move_elem;
        document.onmouseup = _destroy;
}
