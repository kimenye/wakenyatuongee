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

function inTuongeeTimeband(time) {
    var _hour = time.getHours();
    return _hour >= 6 && _hour < 19;
}

function inUwezoTimeBand(time) {
    var _hour = time.getHours();
    return  _hour >= 8 && _hour < 22;
};

//function getStartOfDayForTime(time) {
//    return Date.today().set({ day: time.getDate(), month: time.getMonth(), year: time.getYear() }).clearTime();
//}

var UWEZO_START = Date.today().set({hour: 8, minute: 0, second: 0});
var UWEZO_END = Date.today().set({hour: 23, minute: 0, second: 0});


function uwezoStartOnDay (time) {
    var _res = new Date(time);
    _res = _res.clearTime();
    _res.set({ hour: 8, minute: 0, second: 0});
    return _res;
}

function uwezoEndOfDay(time) {
    var _res = new Date(time);
    _res = _res.clearTime();
    _res.set({ hour: 22, minute: 0, second: 0});
    return _res;
}

function diff(start, end) {
    var _diffInMillseconds = end.getTime() - start.getTime();
    return _diffInMillseconds / 1000;
}

function perSecondCost(duration, rate) {
    return (duration * rate / 60);
}

function perMinuteCost(duration, rate) {
    if (duration < 60)
        return rate;
    else if (duration % 60 == 0)
        return (duration / 60) * rate;
    else if (duration % 60 > 0)
        return (Math.floor(duration / 60) + 1) * rate;
}


var Call = JS.Class({
    construct : function (startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;

        this.inProgress = function() {
            return !this.hasValidEndTime();
        }

        this.duration = function() {
            var _bestEndTime = this.bestEndTime();
            return diff(this.startTime, this.bestEndTime());
        }

//        this.whollyInBand = function(t)

        this.durationInUwezo = function() {
            if (inUwezoTimeBand(this.startTime) && inUwezoTimeBand(this.bestEndTime())) {
                return this.duration();
            }
            else
            {
                if (!inUwezoTimeBand(this.startTime) && inUwezoTimeBand(this.bestEndTime())) {
                    //if we dont start then we need to get the time from be start of the uwezo timeband
                    var _uStart = uwezoStartOnDay(this.startTime);
                    return diff(_uStart, this.bestEndTime());
                }
                else if (inUwezoTimeBand(this.startTime) && !inUwezoTimeBand(this.bestEndTime())){
                    var _uEnd = uwezoEndOfDay(this.bestEndTime());
                    return diff(_uEnd, this.bestEndTime());
                }else if (!inUwezoTimeBand(this.startTime) && !inUwezoTimeBand(this.bestEndTime())) {

                    var _uStart = uwezoStartOnDay(this.startTime);
                    var _uEnd = uwezoEndOfDay(this.bestEndTime());

                    if (this.startTime.compareTo(_uStart) < 1 && this.bestEndTime().compareTo(_uEnd) > 0 ) {
                        return (22 - 8) * 3600;
                    }
                    return 0;
                }
            }
        }

        this.uwezoCost = function() {
            var _uwezoDuration = this.durationInUwezo();
            var _duration = this.duration();

            if (_duration == _uwezoDuration)
                return perSecondCost(_uwezoDuration, 4);
            else if (_uwezoDuration == 0)
                return perSecondCost(_duration, 2);
            else
                return perSecondCost(_uwezoDuration, 4) + perSecondCost(_duration - _uwezoDuration, 2);
        }

        this.bestEndTime = function() {
            return this.hasValidEndTime() ? this.endTime : new Date();
        }

        this.hasValidEndTime = function() {
            return !_.isUndefined(this.endTime) && endTime != null;
        }
    }
});
