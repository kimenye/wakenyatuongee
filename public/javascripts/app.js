var Call = JS.Class({
    construct:function (json) {
        this.type = json["Call Type"];
        this.startTime = Date.parse(json["Call Date"]);
//        this.startTime = json["Call Date"];
        this.duration = json.Duration;
        this.isOutGoing = this.type == "OUTGOING";
        this.isInComing = this.type == "INCOMING";
        this.isNotEmpty = this.duration > 0;


        this.isValid = function() {
            return this.duration > 0 && this.startTime != null && !_.isUndefined(this.startTime);
        }

        this.endTime = function() {
            if (this.isValid()) {
                var _copy = new Date(this.startTime);
                return _copy.addSeconds(this.duration);
            }
            return "";
        }

        this.uwezoCost = function() {
            var _cost = 0;
            if (this.isInUwezoTimeband()) {

            }
            var _cost;
        }

        this.durationInBand = function(bandStartHour, bandEndHour, callStartTime, callEndTime) {
//            if (this.inBand(this.startTime, ))
        }

        this.inBand = function(bandStartHour, bandEndHour, callStartTime, callEndTime) {
             return callStartTime.getHours() >= bandStartHour
                 && callStartTime.getHours() <= bandEndHour
                 && callEndTime.getHours() >= bandStartHour
                 && callEndTime.getHours() <= bandEndHour;
        }

        this.format = function(val) {
            return val ? "Yes" : "No";
        }

        this.startHour = function() {
            return this.startTime.getHours();
        }

        this.endHour = function() {
            return this.endTime().getHours();
        }

        this.inUwezo = function(hour) {
            return  hour >= 8 && hour <= 22;
        }

        this.inTuongee = function(hour) {
            return hour >= 6 && hour <= 18;
        }

        this.isInUwezoTimeband = function () {
            var _val =  this.inUwezo(this.startHour()) && this.inUwezo(this.endHour());
            return this.format(_val);
        }

        this.isInTuongeeTimeband = function() {
            var _val = this.inTuongee(this.startHour()) && this.inTuongee(this.endHour());
            return this.format(_val);
        }
    }
});


function App() {
    var self = this;
    this.calls = ko.observableArray([]);
    this.mode = ko.observable(1);
    this.view = ko.observable("table")

    this.filteredCalls = ko.computed(function() {
        var _mode = this.mode();
        return _.filter(this.calls(), function(call) {
            return (_mode == 0 || (_mode == 1 && call.isOutGoing && call.isValid()));
        });
    },this);

    this.tableVisible = ko.computed(function() {
        return this.view() == "table";
    }, this);

    this.duration = ko.computed(function() {

        var _earliest = _.last(this.calls());
        var _latest = _.first(this.calls());

        if (_earliest != null && _latest != null)
            return " From : " + _earliest.startTime + " to: " + _latest.startTime;
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

    self.toggle = function(value, event) {
        self.view(event.target.id);
    }

}

$(function() {
    ko.applyBindings(new App());
});

