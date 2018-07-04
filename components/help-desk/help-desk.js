const componentName = 'helpDesk';
const moduleName = 'help-desk';

function Controller(apiService){
    let self = this;
    
    window.HELP_DEV = self;
}

let app = angular.module(moduleName, []);
app.component(componentName, {
    template: require('../help-desk/help-desk.html'),
    controller: Controller,
    controllerAs: componentName
});

exports.name = moduleName;