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
                bindings : {
                        groupName: '<',
                        groupOwner: '<',
                        token: '<',
                        showChatGroup: '=',
                        showHelpDesk: '='
                }
        });
function Controller(apiService, $scope, $element, $timeout) {
        let self = this;
        this.conver = {};
        this.token = '';
        this.$onInit = function() {
                console.log(self);
                if(self.groupName=='Help_Desk') {
                        self.color = "#3c763d";
                        self.listUser = [];      
                        self.initHelpDesk = true;
                        self.class = 'success';
                } 
                else {
                        self.class = 'primary';
                        self.color = "#428bca";
                }
                initChat(self.token, self.groupName, self.groupOwner);
        }
        $scope.$watch(function() {return self.groupName=='Help_Desk'?self.showHelpDesk:self.showChatGroup;}, function(newValue, oldValue) {
                
                if(newValue) {
                        if(self.groupName!='Help_Desk' && self.listUser && self.listUser.length<=2) {
                                self.showChatGroup = false;
                                toastr.error('No shared project is opening');
                        }
                        console.log(oldValue, newValue, self.groupName);
                        $element.find('.chat-module').css('right', '0px');
                        $element.find('.chat-module').css('bottom', '0px');
                        $element.find('.chat-module').css('left', 'auto !important');
                        $element.find('.chat-module').css('top', 'auto !important');
                }
        })
        
        $scope.$watch(function() {return self.groupName}, function handleChange(newValue, oldValue) {
                if(oldValue!=newValue) {
                        if(!newValue) {
                                self.initChatGroup = false;
                                self.showChatGroup= false;
                                self.showHelpDesk = false;
                                socket.emit('off-project', {idConversation: self.conver.id, username: self.user.username});
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
        function getChatGroup(projectName) {
                self.initChatGroup = true;
                apiService.getConver({
                        name: projectName
                }, self.token, (res) => {
                if(res) {
                        self.conver = res.conver;
                        self.user = res.user;
                        socket.emit('join-room', {username: self.user.username, idConversation: self.conver.id});
                }
                else
                        self.conver = {};
                })
        }
        
        function initChat(token, projectName, projectOwner) {
                if(!token)
                        toastr.error('Authentization fail');
                else {
                        if(projectName=='Help_Desk') {
                                getChatGroup(projectName+'-'+projectOwner);
                        } 
                        else {
                                if(projectName) {
                                        if(self.conver.id) socket.emit('off-project', {idConversation: self.conver.id, username: self.user.username});
                                        getListUser(projectName, projectOwner, function(res) {
                                                if(res) {
                                                        self.listUser = res;
                                                        if(self.listUser.length >= 2) {
                                                                getChatGroup(projectName);
                                                        } 
                                                        else {
                                                                self.showChatGroup= false;
                                                                self.showHelpDesk = false;
                                                        }
                                                }else {
                                                        self.listUser = [];
                                                        self.showChatGroup= false;
                                                        self.showHelpDesk = false;
                                                }
                                        });
                                } else {
                                        self.projectName = '';
                                        if(self.conver.id)
                                                socket.emit('off-project', {idConversation: self.conver.id, username: self.user.username});
                                }
                        }
                }
        }
        this.showChatGroup = function() {
                return self.groupName=='Help_Desk' || self.listUser.length>=2;
        }
        
        this.draggable = function() {
                $element.find( ".chat-module" ).draggable({
                        start: function() {
                                console.log('************* start ');
                                self.moving = true;
                                swapChatModule();
                        },
                        drag: function() {

                        },
                        stop: function() {
                                self.moving = false;
                        }
                });
        }
        this.onMouseDown = function($event) {
                swapChatModule();
        }
        function swapChatModule() {
                let cms = $('chat-module');
                if ($element.is($(cms[0]))) {
                        $element.insertAfter($(cms[1]));
                }
        }
        this.hideChatFrame = function() {
                if(self.groupName=='Help_Desk') self.showHelpDesk = false;
                else self.showChatGroup = false;
                return false;
        }
        this.showChatFrame = function() {
                if(self.groupName=='Help_Desk') return self.showHelpDesk;
                return self.showChatGroup;
        }
};
