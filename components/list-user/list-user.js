const componentName = 'listUser';
const moduleName = 'list-user';

function Controller($timeout){
    let self = this;
    this.listMemberHeight = 300;
    this.active = function(user) {
        return user.active;
    }
    
    this.chatPersonal = function(user) {
        console.log(user, self.user);
    }
    socket.on('send-members-online', function(data) {
        console.log(data);
        if(self.listUser)
        $timeout(function(){
            for(x of data) {
                console.log(x);
                self.listUser.forEach(function(user) {
                    if(user.username==x) user.active ={"color": "blue"};
                })
            }
        })
    })
    socket.on('disconnected', function(data) {
        if(self.listUser)
        $timeout(function() {
            self.listUser.forEach(function(user) {
                if(user.username==data) user.active ={"color": ""};
            })
        })
    })
    socket.on('off-project', function(data) {
        if(self.listUser)
        $timeout(function() {
            self.listUser.forEach(function(user) {
                if(user.username==data.username) user.active ={"color": ""};
            })
        })
    })
}

let app = angular.module(moduleName, []);
app.component(componentName, {
    template: require('../list-user/list-user.html'),
    controller: Controller,
    controllerAs: componentName,
    bindings: {
        listUser: "<",
        user: "<",
        idConversation: "<",
        token: "<"
    }
});

exports.name = moduleName;