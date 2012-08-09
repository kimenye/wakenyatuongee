var Unit = JS.Class({
    construct:function (duration, at) {
        this.duration = duration;
        this.at = new Date();
        this.cost = function() {
            return 0;
        };

        this.uwezoCost = function() {
            return 0;
        }

        this.tuongeeCost = function() {
            return 0;
        }
    }
});

var Call = JS.Class({
    construct : function (startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;

        this.inProgress = function() {
            return !this.hasValidEndTime();
        }

        this.duration = function() {
            var _bestEndTime = this.hasValidEndTime() ? this.endTime : new Date();
            var _diffInMillseconds = _bestEndTime.getTime() - this.startTime.getTime();
            var _t = new TimeSpan(_diffInMillseconds);
            console.log("S: ", _t.getMinutes());
            return _diffInMillseconds / 1000;
        }

        this.hasValidEndTime = function() {
            return !_.isUndefined(this.endTime) && endTime != null;
        }
    }
});
