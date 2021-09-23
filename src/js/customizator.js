export default class Customizator {
    constructor() {
        this.btnBlock = document.createElement('div');
        this.colorPicker = document.createElement('input');
        this.clear = document.createElement('div');
        this.activeBtn = localStorage.getItem('activeBtn') || this.btns[0];
        this.scale = localStorage.getItem('scale') || 1;
        this.color = localStorage.getItem('color') || '#ffffff';
        this.btns = this.btnBlock.children;
        this.btnBlock.addEventListener('click', (e) => this.onScaleChange(e));
        this.colorPicker.addEventListener('input', (e) => this.onColorChange(e));
        this.clear.addEventListener('click', () => this.reset());
    }

    onScaleChange(e) {
        const body = document.querySelector('body');
        
        try {
            if (e) {
                this.scale = +e.target.value.replace(/x/g, '');
                this.btns.forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active'); 
                this.activeBtn = document.querySelector('.active').getAttribute('data-size');   
                //console.log(this.activeBtn);
                console.log(document.querySelector(`[data-size=${this.activeBtn}]`));
            }
        } catch {}

        const recursy = (element) => {
            element.childNodes.forEach(node => {
                if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0) {

                    if (!node.parentNode.getAttribute('data-fz')) {
                        let value = window.getComputedStyle(node.parentNode, null).fontSize;
                        node.parentNode.setAttribute('data-fz', +value.replace(/px/g, ''));
                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + 'px';
                    } else {
                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + 'px';
                    }

                } else {
                    recursy(node);
                }
            });
        };

        recursy(body);

        localStorage.setItem('scale', this.scale);
        localStorage.setItem('activeBtn', this.activeBtn);
        console.log(localStorage.getItem('activeBtn'));
    }

    onColorChange(e) {
        const body = document.querySelector('body');
        body.style.backgroundColor = e.target.value;
        localStorage.setItem('color', e.target.value);
    }

    setBgColor() {
        const body = document.querySelector('body');
        body.style.backgroundColor = this.color;
        this.colorPicker.value = this.color;
    }

    setActiveBtn() {
        this.btns.forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-size=${this.activeBtn}]`).classList.add('active');
        //localStorage.setItem('activeBtn', this.activeBtn);
    }

    injectStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
            .panel {
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: fixed;
                top: 10px;
                right: 0;
                border: 1px solid rgba(0,0,0, .2);
                box-shadow: 0 0 20px rgba(0,0,0, .5);
                width: 300px;
                height: 60px;
                background-color: #fff;
            
            }
            .scale {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 100px;
                height: 40px;
            }
            .scale_btn {
                display: block;
                width: 40px;
                height: 40px;
                border: 1px solid rgba(0,0,0, .2);
                border-radius: 4px;
                font-size: 18px;
            }
            .scale_btn:hover {
                transform: scale(1.2);
                border: 1px solid black;
                box-shadow: 3px 3px 3px black;
            }
            .color {
                width: 40px;
                height: 40px;
            }
            .clear {
                font-size: 40px;
                cursor: pointer;
            }
            .active {
                background-color: #b5affd;
            }
        `;
        document.querySelector('head').appendChild(style);
    }

    reset() {
        localStorage.clear();
        this.scale = 1;
        this.color = '#ffffff';
        this.setBgColor();
        this.onScaleChange();
        this.btns.forEach(btn => {
            btn.classList.remove('active');
        });
    }

    render() {       
        this.injectStyle();
        this.setBgColor();
        this.onScaleChange();
        
        
        let scaleInputS = document.createElement('input'),
            scaleInputM = document.createElement('input'),
            panel = document.createElement('div');

        panel.append(this.btnBlock, this.colorPicker, this.clear);
        this.clear.innerHTML = "&times";
        this.clear.classList.add('clear');

        scaleInputS.classList.add('scale_btn', 'active');
        scaleInputM.classList.add('scale_btn');
        this.btnBlock.classList.add('scale');
        this.colorPicker.classList.add('color');

        scaleInputS.setAttribute('type', 'button');
        scaleInputS.setAttribute('value', '1x');
        scaleInputS.setAttribute('data-size', 'small');
        scaleInputM.setAttribute('type', 'button');
        scaleInputM.setAttribute('value', '1.5x');
        scaleInputM.setAttribute('data-size', 'big');
        this.colorPicker.setAttribute('type', 'color');
        this.colorPicker.setAttribute('value', '#ffffff');

        this.btnBlock.append(scaleInputS, scaleInputM);

        panel.classList.add('panel');

        document.querySelector('body').append(panel);

        this.setActiveBtn();
    }
}