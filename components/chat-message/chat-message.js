const componentName = 'chatMessage';
const moduleName = 'chat-message';
const iconTextRules = require('./rules');
require('../chat-message/chat-message.css');

Controller.$inject = ['$sce'];
function Controller($sce) {
    let self = this;

    const rules = Object.entries(iconTextRules);
    const regex = toRegex();
    // const regex = /(\:\)\))|(\:\-\))/g;

    self.$onInit = function () {
        preProcess();
    }

    self.$onChanges = function({text}) {
        self.text = text.currentValue
        preProcess()
    }

    self.getHtml = () => {
        const rules = [{
            // encode: '&lt',
            encode: /(\&lt)/g,
            str: '<'
        }, {
            // encode: '&gt',
            encode: /(\&gt)/g,
            str: '>'
        }, {
            // encode: '<br/>',
            encode: /(\<br\/\>)/g,
            str: '<br>'
        }]
        let text = self.text || ''
        rules.forEach(r => {
            text = text.replace(r.encode, r.str)
        })

        return $sce.trustAsHtml(text)
    }

    function preProcess() {
        self.text = replaceText(self.text)  ;
        // ////console.log({'self.text': self.text})
    }


    //change str -> regexable str
    function preRegex(str) {
        //////console.log({str})
        return str
            .split('') //to list char
            .reduce((pre, cur) => `${pre}\\${cur}`, ''); //to string with \ attach to each char
    }

    function toRegex() {

        const listIcon = rules
            .reduce((pre, cur) => {
                
                // if(!pre.length) return cur[1];

                
                // const preIcons = pre[1]["text-replace"];
                const curIcons = cur[1]["text-replace"];


                // //////console.log({pre, cur, curIcons});

                return [...pre, ...curIcons];
            }, [])
        //////console.log({listIcon});
        const regexStr = listIcon
            .reduce((pre, cur, i) => {
                // //////console.log({pre, cur, i})
                const cur_regex_str = preRegex(cur);

                if (i === 0) return pre + cur_regex_str;

                let str = `${pre}|${cur_regex_str}`;

                if (i === listIcon.length - 1) str += ')';

                return str;

            }, '(')

        // const regexStr = listIcon
        //     .reduce((pre, cur, i) => {
        //         // //////console.log({pre, cur, i})
        //         const cur_regex_str = `(${preRegex(cur)})`;

        //         if (i === 0) return pre + cur_regex_str;

        //         let str = `${pre}|${cur_regex_str}`;

        //         if (i === listIcon.length - 1) str += ')';

        //         return str;

        //     }, '(')

        //////console.log({regexStr});
        return new RegExp(regexStr, 'g');

    }

    // function findStr(icon) {
    //     const obj = rules.find(o => o[1].icon === icon);

    //     if (obj) return obj["text-replace"];

    //     return null;
    // }

    function findIcon(text) {
        //////console.log('===findIcon==');
        
        const obj = rules
            .filter(o => {
                const listIcons = o[1]["text-replace"];
                // //////console.log({'o[1][text-replace]': o[1]["text-replace"]});

                return !!listIcons.filter(i => i === text).length;
            })[0]

        // //////console.log({text});
        // //////console.log({rules});
        //////console.log('obj');
        //////console.log();

        //////console.log('XXXX findIcon XXXX');

        if (obj) return obj[1].icon;
        return null;
    }

    //without html
    // function replaceText(str) {
    //     const listIconsVerbose = str.match(regex);
    //     //////console.log({listIconsVerbose});
    //     //remove duplicate
    //     const listIcons = listIconsVerbose.filter((val, i) => listIconsVerbose.indexOf(val) === i);

    //     //////console.log({listIcons});

    //     let result = str;
    //     for (let icon of listIcons) {
    //         const _regex = new RegExp(preRegex(icon));
    //         const replaceIcon = findIcon(icon);
    //         //////console.log({replaceIcon});
    //         if(replaceIcon) result = result.replace(_regex, replaceIcon);
    //     }

    //     return result;
    // }

    function replaceText(str) {
        if(!str) return str

        const listIconsVerbose = str.match(regex);
        //////console.log({listIconsVerbose});
        //remove duplicate
        if(!listIconsVerbose || !listIconsVerbose.length) return str;
        
        const listIcons = listIconsVerbose.filter((val, i) => listIconsVerbose.indexOf(val) === i);

        //////console.log({listIcons});

        let result = str;
        for (let icon of listIcons) {
            const _regex = new RegExp(preRegex(icon));
            const replaceIcon = findIcon(icon);
            const iconHtml = toHtmlWithIcon(replaceIcon);
            //////console.log({replaceIcon});
            if(replaceIcon) result = result.replace(_regex, iconHtml);
        }

        return result;
    }

    function toHtmlWithIcon(className) {
        return `<div class="${className}"></div>`
    }
}



let app = angular.module(moduleName, []);
app.component(componentName, {
    template: require('../chat-message/chat-message.html'),
    controller: Controller,
    controllerAs: componentName,
    bindings: {
        text: '<',
        color: '<'
    }
});

exports.name = moduleName;
