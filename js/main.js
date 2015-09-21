Polymer({
    is: 'pho3nix-dialpad',
    _elements: {},
    isReady: false,
    properties: {
        labels: {
            type: Object,
            value: {
                number1: {
                    text: 1,
                    subtext: ' '
                },
                number2: {
                    text: 2,
                    subtext: 'ABC'
                },
                number3: {
                    text: 3,
                    subtext: 'DEF'
                },
                number4: {
                    text: 4,
                    subtext: 'GHI'
                },
                number5: {
                    text: 5,
                    subtext: 'JKL'
                },
                number6: {
                    text: 6,
                    subtext: 'MNO'
                },
                number7: {
                    text: 7,
                    subtext: 'PQRS'
                },
                number8: {
                    text: 8,
                    subtext: 'TUV'
                },
                number9: {
                    text: 9,
                    subtext: 'WXYZ'
                },
                number0: {
                    text: 0,
                    subtext: '+'
                },
                star: {
                    text: '*',
                    subtext: ' '
                },
                hashtag: {
                    text: '#',
                    subtext: ' '
                },
                transfer: {
                    text: 'TRANSFER'
                },
                consult: {
                    text: 'CONSULT'
                },
                conference: {
                    text: 'CONFERENCE'
                },
                call: {
                    text: 'CALL'
                },
                hold: {
                    text: 'HOLD'
                },
                resume: {
                    text: 'RESUME'
                },
                endcall: {
                    text: 'END CALL'
                },
                placeholder:{
                    text: 'Telephone number'   
                },
                validationErrorMessage:{
                    text: 'Numbers only!'
                },
                history:{
                    text: 'HISTORY'
                }
            }
        },
        state: { 
            type: String,
            value: 'none',
            observer: '_stateChanged'
        },
        transfer: {
            type: Boolean,
            value: false,
            observer: '_transferChanged'
        },
        consult: {
            type: Boolean,
            value: false,
            observer: '_consultChanged'
        },
        conference: {
            type: Boolean,
            value: false,
            observer: '_conferenceChanged'
        },
        value: {
            type: String,
            value: ''
        }
    },
    _stateChanged: function(n, o){
        if (this.isReady) {
            this.dispatchEvent(new CustomEvent("onStateChanged",{ 
                detail: { 
                    old: o,
                    new: n,
                }
            }))
        }
    },
    _transferChanged: function(n, o){
        if (this.isReady) this._elements['transfer'].setAttribute('active', true);
    },
    _consultChanged: function(n, o){
        if (this.isReady) this._elements['consult'].toggle();
    },
    _conferenceChanged: function(n, o){
        if (this.isReady) this._elements['conference'].toggle();
    },
    _initEvents: function(){
        this.addEventListener("onReady", initEvents);
        function initEvents(){
            var polymerContext = this;
            var numberElements = this.querySelectorAll("[id^=number]");
            for(var i = 0; i<numberElements.length; i++){
                var element = numberElements[i];
                element.addEventListener("mousedown", onMouseDown);
                element.addEventListener("mouseup", onMouseUp);
            }
            this._elements.clearWholeNumber.addEventListener("click",onClearPressed);
            this._elements.transfer.addEventListener("click",onTransferPressed);
            this._elements.consult.addEventListener("click",onConsultPressed);
            this._elements.conference.addEventListener("click",onConferencePressed);

            this._elements.callHold.addEventListener("click",onCallHoldPressed);

            this._elements.endCall.addEventListener("click",onEndCallPressed);
            this._elements.wholeNumber.addEventListener("change", onChange);

            /*DEFAULT HANDLERS*/
            this.addEventListener("onNumberPressed", function(e){
                polymerContext._elements["wholeNumber"].value += e.detail.text;
                polymerContext.value = polymerContext._elements["wholeNumber"].value;
            });
            this.addEventListener("onNumberLongPressed", function(e){
                switch(e.detail.text){
                    case "0":
                        polymerContext._elements["wholeNumber"].value += e.detail.subtext;
                        break;
                    default:
                        polymerContext._elements["wholeNumber"].value += e.detail.text;
                        break;
                }
                polymerContext.value = polymerContext._elements["wholeNumber"].value;
            });
            this.addEventListener("onClearPressed", function(e){
                polymerContext._elements["wholeNumber"].value = "";
                polymerContext.value = polymerContext._elements["wholeNumber"].value;
            });
            this.addEventListener('onStateChanged', function(e){
                switch(e.detail.new){
                    case 'none': case 'call': case 'hold':
                        this._elements['callHold'].setAttribute("state", e.detail.new);
                        break;
                    default:
                        throw e.detail.new + ' is not a valid state';
                        break;
                }
            });

            /*INNER HANDLERS*/
            function onMouseDown(e){
                var self = this;
                this.setAttribute("data-lp-start", e.timeStamp);
                this.setAttribute("data-lp-id", setTimeout(longPress, 500));
                function longPress() {
                    polymerContext.dispatchEvent(new CustomEvent("onNumberLongPressed",{ 
                        detail: { 
                            text: self.querySelector("span.number").innerHTML,
                            subtext: self.querySelector("span.letters").innerHTML,
                        } 
                    }));
                }
            }
            function onMouseUp(e){
                e.pressedTime = e.timeStamp - this.getAttribute("data-lp-start");
                if (e.pressedTime < 500){
                    clearInterval(this.getAttribute("data-lp-id"));
                    polymerContext.dispatchEvent(new CustomEvent("onNumberPressed",{ 
                        detail: { 
                            text: this.querySelector("span.number").innerHTML,
                            subtext: this.querySelector("span.letters").innerHTML,
                        } 
                    }));
                }
                this.removeAttribute("data-lp-start");
                this.removeAttribute("data-lp-id");
            }
            function onClearPressed(e){
                polymerContext.dispatchEvent(new CustomEvent("onClearPressed", e));
            }
            function onTransferPressed(e){
                polymerContext.dispatchEvent(new CustomEvent("onTransferPressed", e));
            }
            function onConsultPressed(e){
                polymerContext.dispatchEvent(new CustomEvent("onConsultPressed", e));
            }
            function onConferencePressed(e){
                polymerContext.dispatchEvent(new CustomEvent("onConferencePressed", e));
            }
            function onEndCallPressed(e){ 
                polymerContext.dispatchEvent(new CustomEvent("onEndCallPressed", e));
            }
            function onCallHoldPressed(e){
                switch(polymerContext.state){
                    case 'none': case undefined:
                        polymerContext.dispatchEvent(new CustomEvent("onCallPressed", e));
                        break;
                    case 'call':
                        polymerContext.dispatchEvent(new CustomEvent("onHoldPressed", e));
                        break;
                    case 'hold':
                        polymerContext.dispatchEvent(new CustomEvent("onResumePressed", e));
                        break;
                }
            }                
            function onChange(e){
                e.detail = {text: this.value};
                polymerContext.dispatchEvent(new CustomEvent("onChange", e));
            }            
        }
    },
    created: function() {
        this._initEvents.apply(this);
    },
    attached: function() {
        for (var i = 0; i < 10; i++){
            this._elements['number'+i] = this.querySelector('#number'+i);    
        }
        this._elements['numberStar'] = this.querySelector('#numberStar');
        this._elements['numberHashtag'] = this.querySelector('#numberHashtag');

        this._elements['transfer'] = this.querySelector('#transfer');
        this._elements['consult'] = this.querySelector('#consult');
        this._elements['conference'] = this.querySelector('#conference');

        this._elements['wholeNumber'] = this.querySelector('#wholeNumber');
        this._elements['clearWholeNumber'] = this.querySelector('#clearWholeNumber');

        this._elements['callHold'] = this.querySelector('#callHold');
        this._elements['endCall'] = this.querySelector('#endCall');

        this.isReady = true;
        this.dispatchEvent(new CustomEvent("onReady"));
    }
  });