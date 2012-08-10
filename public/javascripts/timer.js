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

function inBand(time, start, end) {
    var _hour = time.getHours();
    return  _hour >= start && _hour < end;
}

function inTuongeeTimeband(time) {
    return inBand(time, 6, 18);
}

function inUwezoTimeBand(time) {
    return inBand(time, UWEZO_START, UWEZO_END);
}

//function getStartOfDayForTime(time) {
//    return Date.today().set({ day: time.getDate(), month: time.getMonth(), year: time.getYear() }).clearTime();
//}

var UWEZO_START = 8;
var UWEZO_END = 22;
var TUONGEE_START = 6;
var TUONGEE_END = 18;


function timeBandOnDay(time, hour, minute) {
    var _res = new Date(time);
    _res = _res.clearTime();
    _res.set({ hour: hour, minute: minute, second: 0});
    return _res;
}

function uwezoStartOnDay (time) {
    return timeBandOnDay(time, UWEZO_START, 0);
}

function uwezoEndOfDay(time) {
    return timeBandOnDay(time, UWEZO_END, 0);
}

function tuongeeStartOnDay (time) {
    return timeBandOnDay(time, TUONGEE_START, 0);
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

        this.whollyInBand = function(startHour, endHour) {
            return inBand(this.startTime, startHour, endHour) && inBand(this.bestEndTime(), startHour, endHour);
        }

        this.startsOutside = function(startHour, endHour) {
            return !inBand(this.startTime, startHour, endHour) && inBand(this.bestEndTime(), startHour, endHour);
        }

        this.endsOutside = function(startHour, endHour) {
            return inBand(this.startTime, startHour, endHour) && !inBand(this.bestEndTime(), startHour, endHour);
        }

        this.startsBeforeAndEndsAfter = function(startHour, endHour) {
            return !inBand(this.startTime, startHour, endHour) && !inBand(this.bestEndTime(), startHour, endHour);
        }

        this.durationInUwezo = function() {
            return this.durationInBand(UWEZO_START, UWEZO_END);
        }

        this.durationInTuongee = function() {
            return this.durationInBand(UWEZO_START, UWEZO_END);
        }

        this.durationInBand = function(startHour, endHour) {
            if(this.whollyInBand(startHour, endHour))
                return this.duration();
            else
            {
                if (this.startsOutside(startHour, endHour)) {
                    var _start = timeBandOnDay(this.startTime, startHour, 0);
                    return diff(_start, this.bestEndTime());
                }

                else if (this.endsOutside(startHour, endHour)) {
                    var _end = timeBandOnDay(this.bestEndTime(), endHour, 0);
                    return diff(_end, this.bestEndTime());
                }
                else if (this.startsBeforeAndEndsAfter(startHour, endHour)) {
                    var start = timeBandOnDay(this.startTime, startHour, 0);
                    var end = timeBandOnDay(this.bestEndTime(), endHour, 0);

                    if (this.startTime.compareTo(start) < 1 && this.bestEndTime().compareTo(end) > 0 ) {
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
