var Call = JS.Class({
    construct:function (json) {
        this.type = json["Call Type"];
        this.callDate = new Date(json["Call Date"]);
        this.duration = json.Duration;
        this.isOutGoing = this.type == "OUTGOING";
        this.isInComing = this.type == "INCOMING";
        this.isNotEmpty = this.duration > 0;
    }
});


function App() {
    var self = this;
    this.calls = ko.observableArray([]);
    this.mode = ko.observable(1);

    this.filteredCalls = ko.computed(function() {
        var _mode = this.mode();
        return _.filter(this.calls(), function(call) {
            return (_mode == 0 || (_mode == 1 && call.isOutGoing && call.isNotEmpty));
        });
    },this);

    this.toggle = function(value) {
//        this.mode(value);
        console.log("Mode should be " + value);
    };

    this.duration = ko.computed(function() {

        var _earliest = _.last(this.calls());
        var _latest = _.first(this.calls());

        if (_earliest != null && _latest != null)
            return " From : " + _earliest.callDate + " to: " + _latest.callDate;
    },this);

    $.ajax({
        type:"GET",
        url:"/log",
        success:function (data) {
            if (_.isArray(data)) {
                var models = [];
                _.each(data, function (item) {
                    models.push(new Call(item));
                });
                self.calls(models);
            }
        }
    });

}

ko.applyBindings(new App());

