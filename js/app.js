require('../css/style.css');
let chatService = require('../services/api-service.js');
let chatGroup = require('../components/chat-group/chat-group.js');
let helpDesk = require('../components/help-desk/help-desk.js');
let listUser = require('../components/list-user/list-user.js');
let moduleName = componentName = 'chatModule';

angular.module(moduleName, [chatService.name, chatGroup.name, helpDesk.name, listUser.name, 'ngFileUpload'])
        .component(componentName, {
                template: require('../index.html'),
                controller: Controller,
                controllerAs: 'cm',
                bindings: {
                        groupName: '<',
                        groupOwner: '<',
                        token: '<',
                        username: '<',
                        width: '<',
                        showChatGroup: '=',
                        showHelpDesk: '='
                }
        });

function Controller(apiService, $scope, $element, $timeout) {
        let self = this;
        this.conver = {};
        this.token = '';
        const HELP_DESK = 'Help_Desk';
        const HELP_DESK_COLOR = '#3c763d';
        const HELP_DESK_CLASS = 'success';
        const GROUP_COLOR = '#428bca';
        const GROUP_CLASS = 'primary';
        let cm = $('chat-module');
        if ($element.is($(cm[0]))) {
                $(cm[0]).css('z-index', '100');
        } else {
                $(cm[1]).css('z-index', '100');
        }
        this.$onInit = function () {
                if (self.groupName == HELP_DESK) {
                        self.color = HELP_DESK_COLOR;
                        self.listUser = [];
                        self.initHelpDesk = true;
                        self.class = HELP_DESK_CLASS;
                }
                else {
                        self.class = GROUP_CLASS;
                        self.color = GROUP_COLOR;
                }
                initChat(self.token, self.groupName, self.groupOwner);
        }
        $scope.$watch(function() { return self.showChatGroup; }, function(newValue, oldValue) {
                if(!newValue) {
                        let cm = $('chat-module');
                        console.log('chat');
                        if ($element.is($(cm[0]))) {
                                $(cm[0].children[1]).css('z-index', '-1');
                        } else {
                                $(cm[1].children[1]).css('z-index', '-1');
                        }
                } else {
                        let cm = $('chat-module');
                        console.log('chat');
                        if ($element.is($(cm[0]))) {
                                $(cm[0].children[1]).css('z-index', '100');
                        } else {
                                $(cm[1].children[1]).css('z-index', '100');
                        }
                }
        })
        $scope.$watch(function() { return self.showHelpDesk; }, function(newValue, oldValue) {
                if(!newValue) {
                        let cm = $('chat-module');
                        console.log('help dev');
                        if ($element.is($(cm[0]))) {
                                $(cm[0].children[1]).css('z-index', '-1');
                        } else {
                                $(cm[1].children[1]).css('z-index', '-1');
                        }
                }else {
                        let cm = $('chat-module');
                        console.log('help dev');
                        if ($element.is($(cm[0]))) {
                                $(cm[0].children[1]).css('z-index', '100');
                        } else {
                                $(cm[1].children[1]).css('z-index', '100');
                        }
                }
        })
        $scope.$watch(function () { return self.groupName == HELP_DESK ? self.showHelpDesk : self.showChatGroup; }, function (newValue, oldValue) {

                if (newValue) {
                        if (self.groupName != HELP_DESK && self.listUser && self.listUser.length <= 2) {
                                self.showChatGroup = false;
                                toastr.error('No shared project is opening');
                        }
                        let cm = $element.find('.chat-module');
                        $(cm).css('left', 'auto');
                        $(cm).css('top', 'auto');
                }
        })

        $scope.$watch(function () { return self.groupName }, function handleChange(newValue, oldValue) {
                if (oldValue != newValue) {
                        if (!newValue) {
                                self.initChatGroup = false;
                                self.showChatGroup = false;
                                self.showHelpDesk = false;
                                self.user = {};
                                self.user.username = window.localStorage.getItem('username');
                                socket.emit('off-project', { idConversation: self.conver.id, username: self.user.username });
                        }
                        initChat(self.token, self.groupName, self.groupOwner);
                }
        });
        $scope.$watch(function () { return self.token }, function handleChange(newValue, oldValue) {
                if (oldValue != newValue) {
                        if (!newValue) {
                                self.initChatGroup = false;
                                self.showChatGroup = false;
                                self.showHelpDesk = false;
                                self.user = {};
                                self.user.username = window.localStorage.getItem('username');
                                socket.emit('off-project', { idConversation: self.conver.id, username: self.user.username });
                        }
                        initChat(self.token, self.groupName, self.groupOwner);
                }
        });

        function getListUser(projectName, projectOwner, cb) {
                apiService.getListUserOfProject({
                        project_name: projectName,
                        owner: projectOwner
                }, self.token, (res) => {
                        cb(res);
                })
        }
        function getChatGroup(projectName, users) {
                self.initChatGroup = true;
                apiService.getConver({
                        name: projectName,
                        users: users
                }, self.token, (res) => {
                        if (res) {
                                self.conver = res.conver;
                                self.user = res.user;
                                socket.emit('join-room', { username: self.user.username, idConversation: self.conver.id });
                        }
                        else
                                self.conver = {};
                })
        }

        function initChat(token, projectName, projectOwner) {
                if (!token)
                        toastr.error('Authentization fail');
                else {
                        if (projectName == HELP_DESK) {
                                getChatGroup(projectName + '-' + self.username);
                        }
                        else {
                                if (projectName) {
                                        if (self.conver.id) socket.emit('off-project', { idConversation: self.conver.id, username: self.user.username });
                                        getListUser(projectName, projectOwner, function (res) {
                                                if (res) {
                                                        self.listUser = res;
                                                        if (self.listUser.length >= 2) {
                                                                getChatGroup(projectName);
                                                        }
                                                        else {
                                                                self.showChatGroup = false;
                                                                self.showHelpDesk = false;
                                                        }
                                                } else {
                                                        self.listUser = [];
                                                        self.showChatGroup = false;
                                                        self.showHelpDesk = false;
                                                }
                                        });
                                } else {
                                        self.projectName = '';
                                        if (self.conver.id)
                                                socket.emit('off-project', { idConversation: self.conver.id, username: self.user.username });
                                }
                        }
                }
        }
        this.showChatGroup = function () {
                return self.groupName == HELP_DESK || self.listUser.length >= 2;
        }

        this.draggable = function () {
                $element.find(".chat-module").draggable({
                        start: function () {
                                self.moving = true;
                                swapChatModule();
                        },
                        drag: function () {

                        },
                        stop: function () {
                                self.moving = false;
                        }
                });
        }
        this.onMouseDown = function ($event) {
                swapChatModule();
        }
        function swapChatModule() {
                let cms = $('chat-module');
                if ($element.is($(cms[0]))) {
                        $element.insertAfter($(cms[1]));
                }
        }
        this.hideChatFrame = function () {
                if (self.groupName == HELP_DESK) self.showHelpDesk = false;
                else self.showChatGroup = false;
                return false;
        }
        this.showChatFrame = function () {
                if (self.groupName == HELP_DESK) return self.showHelpDesk;
                return self.showChatGroup;
        }
};
