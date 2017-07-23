module xtal.elements{
    function initXtalFormation(){
        if(customElements.get('xtal-formation')) return;
        

        interface IXtalFormationProperties{
            publishForm: boolean | polymer.PropObjectType,
            objectifiedForm: object | polymer.PropObjectType,
            computedRequestUrl: string | polymer.PropObjectType,
            computedRequestBody: string | polymer.PropObjectType,            
        }

        function objectify(form: HTMLFormElement, asObject?: boolean) : string | {[key: string] : string | string[]} {
            if (!form || form.nodeName !== "FORM") {
                return;
            }
            //var i, j, q = [];
            let q : string[];
            let p : {[key: string] : string | string[]};
            if(asObject){
                p = {};
            }else{
                q = [];
            }
            for (let i = form.elements.length - 1; i >= 0; i = i - 1) {
                const elm = form.elements[i] as HTMLInputElement;
                if (elm.name === "") {
                    continue;
                }
                if(elm.name.indexOf('_ignore_') === 0){
                    continue;
                }
                let val: string;
                if(q){
                    val = encodeURIComponent(elm.value);
                }else{
                    val = elm.value;
                }
                switch (elm.nodeName) {
                    case 'INPUT':
                        switch (elm.type) {
                            case 'text':
                            case 'hidden':
                            case 'password':
                            case 'button':
                            case 'reset':
                            case 'submit':
                                if(q){
                                    q.push(elm.name + "=" + val);
                                }else{
                                    p[elm.name] = val;
                                }

                                break;
                            case 'checkbox':
                            case 'radio':
                                if (elm.checked) {
                                    if(q){
                                        q.push(elm.name + "=" + val);
                                    }else{
                                        if(p[elm.name]){
                                            p[elm.name] = [];
                                        }
                                        p[elm.name]['push'](val);
                                    }
                                }
                                break;
                            case 'file':
                                break;
                        }
                        break;
                    case 'TEXTAREA':
                        if(q){
                            q.push(elm.name + "=" + val);
                        }else{
                            p[elm.name] = val;
                        }
                        break;
                    case 'SELECT':
                        switch (elm.type) {
                            case 'select-one':
                                if(q){
                                    q.push(elm.name + "=" + val);
                                }else{
                                    p[elm.name] = val;
                                }
                                break;
                            case 'select-multiple':
                                const selm = <HTMLSelectElement><any>elm;
                                const options = selm.options;
                                for (let j = options.length - 1; j >= 0; j = j - 1) {
                                    if (options[j]['selected']) {
                                        let val2: string;
                                        if(q){
                                            val2 =  encodeURIComponent(options[j]['value']);
                                        }else{
                                            val2 = options[j]['value'];
                                        }
                                        if(q){
                                            q.push(elm.name + "=" + val);
                                        }else{
                                            if(!p[elm.name]){
                                                p[elm.name] = [];
                                            }
                                            p[elm.name]['push'](val);
                                        }

                                    }
                                }
                                break;
                        }
                        break;
                    case 'BUTTON':
                        switch (elm.type) {
                            case 'reset':
                            case 'submit':
                            case 'button':
                                if(q){
                                    q.push(elm.name + "=" + val);
                                }else{
                                    if(!p[elm.name]){
                                        p[elm.name] = [];
                                    }
                                    p[elm.name]['push'](val);
                                }
                                break;
                        }
                        break;
                }
            }
            if(q){
                return q.join("&");
            }else{
                return p;
            }
        }
        function validateInputElement(inputEl: HTMLInputElement){
            const val = inputEl.value;
            if(inputEl.required && val.length === 0) return false;
            if(inputEl.maxLength != -1 && val.length > inputEl.maxLength) return false;
            if(inputEl.pattern){
                const regExp = new RegExp(inputEl.pattern);
                if(! regExp.test(val)) return false;
            }
            //TODO:  set class?
            return true;
        }        
        /**
         * `xtal-formation`
         * Declaratively create an object and query string from a form
         *
         * @customElement
         * @polymer
         * @demo demo/index.html
        */
        class XtalFormation extends Polymer.Element implements IXtalFormationProperties{

            publishForm: boolean;
            objectifiedForm;
            computedRequestUrl;
            computedRequestBody;
            recomputeOnEnable: boolean;
            //static get is(){return 'xtal-formation';}
            static get properties() : IXtalFormationProperties{
                return{
                    /**
                    * Must be true for this component to be activated
                    */
                    publishForm:{
                        type: Boolean,
                        observer: 'onPublishForm'
                    },
                    /**
                     * Expression for where to publish the form as a plain old JavaScript object
                     */
                    objectifiedForm:{
                        type: Object,
                        notify: true,
                        readOnly: true,
                    },
                    /**
                     * Expression for where to publish the url / query string portion of a form.
                     * If method of form inside this element is get, input elements will be added to the query string
                     */
                    computedRequestUrl:{
                        type: String,
                        notify: true,
                        readOnly: true,
                    },
                    /**
                     * Expression for where to publish the body portion of a url request, as a regular form
                     * would do.  If method of form is  POST, then the input elements inside the form
                     * will be added to the request body 
                     */
                    computedRequestBody:{
                        type: String,
                        notify: true,
                        readOnly: true,
                    }
                }
            }
            // static validate(formElm: HTMLFormElement, serializedForm: any) : boolean {
            //     //if(!formElm) formElm = this.querySelector('form') as HTMLFormElement;
            //     if(!serializedForm) serializedForm = serialize(formElm, true);
            //     //const validator = this.querySelector('js-validator') as HTMLElement;
            //     let  customValidatorFns;
            //     if(validator){
            //         customValidatorFns = eval(validator.innerText);
            //     }
            //     if(customValidatorFns){
            //         for(const customValidatorFn of customValidatorFns){
            //             if(!customValidatorFn(serializedForm)) return false;
            //         }
            //     }
            //     return true;
            // }
            updateInfo(formElm: HTMLFormElement){
                if(!formElm) formElm = this.querySelector('form') as HTMLFormElement;
                if(!this.publishForm){
                    //this.recomputeOnEnable = true;
                    return;
                }
                const formData = objectify(formElm, true);
                //if(!this.validate(formElm, formData)) return;
                this['_setObjectifiedForm'](formData);
                const queryString = objectify(formElm, false);
                const method = formElm.method.toLowerCase();
                const action = formElm.action;
                switch(method){
                    case 'get':
                        const delim = action.indexOf('?') > -1 ? '&' :  '?';
                        this['_setComputedRequestUrl'](action + delim + queryString);
                        this['_setComputedRequestBody']('');
                        break;
                    default:
                        this['_setComputedRequestUrl'](action);
                        this['_setComputedRequestBody'](queryString);
                        break;
                }

            }
            ready(){
                super.ready();
                const formElm = this.querySelector('form') as HTMLFormElement;
                if(!formElm) throw 'Need a form inside this element';
                const childInputs = formElm.querySelectorAll('input');
                for(let i = 0, ii = childInputs.length; i < ii; i++){
                    const childInput = childInputs[i] as HTMLInputElement;
                    if(childInput.type === 'hidden'){
                        childInput['_value'] = childInput.value;
                        const _this = this;
                        Object.defineProperty(childInput, "value", {
                            get: function() {return this._value;},
                            set: function(v) {
                                ;
                                this._value = v;
                                if(!validateInputElement(this as HTMLInputElement)) return;
                                _this.updateInfo(formElm);
                            }
                        });
                    }else{
                        childInput.addEventListener('input', e =>{
                            this.updateInfo(formElm);
                        })
                    }

                }
                this.updateInfo(formElm);
            }
            onPublishForm(newVal){
                if(newVal) this.updateInfo(null);
            }

        }
        customElements.define('xtal-formation', XtalFormation);
    }
    const syncFlag = 'xtal_elements_formation_sync'
    if(window[syncFlag]){
        customElements.whenDefined('poly-prep-sync').then(() => initXtalFormation());
        delete window[syncFlag];
    }else{
        if(customElements.get('poly-prep') || customElements.get('full-poly-prep')){
            initXtalFormation();
        }else{
            customElements.whenDefined('poly-prep').then(() => initXtalFormation());
            customElements.whenDefined('full-poly-prep').then(() => initXtalFormation());
        }
    
    }
}    


