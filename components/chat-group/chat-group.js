const componentName = 'chatGroup';
const moduleName = 'chat-group';

function Controller(apiService, $timeout, $element){
    const WIDTH_IMAGE_THUMB = 130;
    let self = this;

    this.listMessageHeight = 300;
    let textMessage = $element.find('.text-message');
    let listMessage = $element.find('.list-message');
    textMessage.keypress(function (e) {
        if (e.which == 13 && !e.shiftKey) {
            let content = textMessage.val();
            content = content.trim();
            if(content) {
                let message = {
                    content: preventXSS(content),
                    type: 'text',
                    idSender: self.user.id,
                    idConversation: self.conver.id,
                    User: self.user,
                    sendAt: new Date()
                };
                apiService.postMessage(message, self.token, function (res) {
                });
            }
            e.preventDefault();
            textMessage.val('');
        }
    });
    this.upload = function (files) {
        async.forEachOfSeries(files, (file, i, _done) => {
            let type = file.type.substring(0, 5);
            apiService.upload({
                file: file,
                fields: {'name': self.conver.name, 'width': WIDTH_IMAGE_THUMB}
            }, self.token, (res) => {
                if(res) {
                    let message = {
                        content: res,
                        type: type=='image'?'image':'file',
                        idSender: self.user.id,
                        idConversation: self.conver.id,
                        User: self.user,
                        sendAt: new Date((new Date()).getTime())
                    }
                    apiService.postMessage(message, self.token, (res) => {
                        _done();
                    });
                }
            })
        }, (err) => {

        });
    }
    let lengthUrl = apiService.url.length;
    this.getImageOrigin = function(path) {
        let p = path.slice(lengthUrl+1);
        return apiService.url + '/api/imageOrigin/'+p+'?token='+self.token;
    }
    this.download = function(path) {
        let p = path.slice(lengthUrl+1);
        return apiService.url + '/api/download/'+p+'?token='+self.token;
    }
    this.thumb = function(path) {
        let p = path.slice(lengthUrl+1);
        return apiService.url + '/api/thumb/'+p+'?token='+self.token;
    }
    this.fileName = function(path) {
        return path.substring(lengthUrl+35+self.conver.name.length, path.length);
    }
    socket.on('sendMessage', function (data) {
        window.data = data;
        // data.sendAt = (new Date(data.sendAt.toString())).toString();
        if(self.conver.id == data.idConversation) {
            self.conver.Messages = self.conver.Messages?self.conver.Messages:[];
            $timeout(function() {
                self.conver.Messages.push(data);
                console.log(data.sendAt);
                $timeout(function(){
                    listMessage.scrollTop(listMessage[0].scrollHeight);
                }, 500);
            });


        }
    });
    this.getDate = function(t1, t2) {
        let time1 = new Date(t1);
        let time2 = new Date(t2);
        return time1.toString().substring(0, 15)!=time2.toString().substring(0,15);
    }
    function preventXSS(text) {
        const rule = {
            '<': {
                regex: /\</g,
                replaceStr: '&lt'
            },
            '>' : {
                regex: /\>/g,
                replaceStr: '&gt'
            }
        };

        text = text.replace(rule['>'].regex, rule['>'].replaceStr);
        text = text.replace(rule['<'].regex, rule['<'].replaceStr);

        return text;

    }
}

let app = angular.module(moduleName, []);
app.component(componentName, {
    template: require('../chat-group/chat-group.html'),
    controller: Controller,
    controllerAs: componentName,
    bindings: {
        conver: "<",
        user: "<",
        token: "<",
        color: "<"
    }
});

exports.name = moduleName;
