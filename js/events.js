if (Array.prototype.filter === undefined) throw "This module requires ECMAScript 6";
function $Event() { };
$Event.prototype._events = [];
$Event.prototype.raised = 0;
$Event.prototype.supressed = false;
$Event.prototype.addEventListener = function(f){
    if (typeof f != 'function') throw "Argument supplied is not a function";
    this._events.push = f;
}
$Event.prototype.removeEventListener = function(f){
    var oldCount = this._events.length;
    this._events = this._events.filter(function(x){ return x !== f })
}
$Event.prototype.raise = function(context, args){
    context = context ? context : window;
    if (this.supressed === false) {
        this.raised++;
        for(var i in this._events){
            this._events[i].apply(context, Array.prototype.slice.call(arguments,1));
        }
    }
}
    