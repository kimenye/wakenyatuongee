var Call = JS.Class({
    construct:function (json) {
        this.type = json["Call Type"];
        this.callDate = json["Call Date"];
        this.duration = json.Duration;
        this.isOutGoing = this.type == "OUTGOING";
        this.isInComing = this.type == "INCOMING";
    }
});


function App() {
    var self = this;
    this.calls = ko.observableArray([]);
    this.mode = ko.observable(1);

    this.filteredCalls = ko.computed(function() {
        var mode = this.mode();
        console.log("Mode is " + mode);
        var _before = this.calls();
        console.log("Number of calls before is " + _before.length);
//        return _.filter(_before, function(call) {
//
//            if (mode == 0) {
//                console.log("Returning true because mode is " + mode);
//                return true;
//            }
//            else if (mode == 1) {
//                return call.isOutGoing == true;
//            }
//            else if (mode == 2) {
//                return call.isInComing == true;
//            }
//        });
        var _filtered = _.filter(_before, function(c) {
           return false;
        });
    },this);

    this.toggle = function(value) {
//        this.mode(value);
        console.log("Mode should be " + value);
    };

    self.selectView = function() {
//        location.hash = view.type;
        console.log("clicked!");
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

