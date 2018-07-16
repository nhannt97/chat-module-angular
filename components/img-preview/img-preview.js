const componentName = 'imgPreview';
const moduleName = 'img-preview';
require('../img-preview/img-preview.css');

function Controller() {
    let self = this;
    // let modalImg, modal;  //tag

    self.$onInit = function () {


        // console.log('inside');
        // const modal = $element.find('modal');
        // const img = $element.find('.main-img');
        // const modalImg = $element.find('.modal-content');


        // console.log(self.source);
        // // console.log('img-preview');
        // console.log({modal});
        // console.log({img});
        // console.log({modalImg});

        preProcess();
        enableZoom();

    }

    self.imgOnclick = function () {

        const modal = document.getElementById(self._modal);
        const modalImg = document.getElementById(self._modalImg);

        modal.style.display = "block";
        // modalImg.src = self.source;
    }

    self.closeOnClick = function () {
        const modal = document.getElementById(self._modal);

        modal.style.display = 'none';
        // console.log('img click');
        // console.log({modal});
    }

    // self.downloadOnClick = function () {
    //     // self.downloadFunc(self.source);
    //     // console.log('download');

    //     // const a = document.createElement('a');
    //     // a.download = true;
    //     // a.href = self.source;

    //     // a.onclick = function(e) {
    //     //     e.preventDefault();
    //     // }

    //     // a.click();

    //     console.log(self.downloadFunc());
    // }


    function preProcess() {
        self._modal = genUniqueId('modal');
        // self._img = genUniqueId('img');
        self._modalImg = genUniqueId('modal-img');
        // self._closeBtn = genUniqueId('close-btn');

        // img = document.getElementById(self._img);


        // console.log(modal);
        // console.log(modalImg);
        // closeBtn = document.getElementById(self._closeBtn);
    }

    function genUniqueId(name, src = self.smallImgLink) {
        const now = Date.now().toString();

        return `__${now}-${src}-${name}__`;
    }

    function enableZoom() {
        document.querySelector('figure.zoom').onmousemove = function(e) {
            const zoomer = e.currentTarget;
            let offsetX, offsetY, x, y;
            
            zoomer.style.backgroundImage = `url('${self.fullImgLink}')`;
            e.offsetX ? offsetX = e.offsetX : offsetX = e.touches[0].pageX
            e.offsetY ? offsetY = e.offsetY : offsetX = e.touches[0].pageX
            x = offsetX / zoomer.offsetWidth * 100
            y = offsetY / zoomer.offsetHeight * 100
            zoomer.style.backgroundPosition = x + '% ' + y + '%';
        }
    }
}


let app = angular.module(moduleName, []);
app.component(componentName, {
    template: require('../img-preview/img-preview.html'),
    controller: Controller,
    controllerAs: componentName,
    bindings: {
        smallImgLink: '<',
        downloadLink: '<',
        fullImgLink: '<'
    }
});

exports.name = moduleName;