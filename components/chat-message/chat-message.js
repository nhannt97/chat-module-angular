const componentName = 'chatMessage';
const moduleName = 'chat-message';
require('../chat-message/chat-message.css');

function Controller() {
    let self = this;
    // let modalImg, modal;  //tag
    // 
}


let app = angular.module(moduleName, []);
app.component(componentName, {
    template: require('../chat-message/chat-message.html'),
    controller: Controller,
    controllerAs: componentName,
    bindings: {
    }
});

exports.name = moduleName;