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


var UWEZO_START = 8;
var UWEZO_END = 22;
var TUONGEE_START = 6;
var TUONGEE_END = 18;


function timeBandOnDay(time, hour) {
    var _res = new Date(time);
    _res = _res.clearTime();
    _res.set({ hour: hour, minute: 0, second: 0});
    return _res;
}

function diff(start, end) {
    var _diffInMillseconds = end.getTime() - start.getTime();
    return _diffInMillseconds / 1000;
}

function perSecondCost(duration, rate) {
    return (duration * rate / 60);
}

function stepWiseCost(duration) {
    if (duration <= 60)
        return cost(duration, 4, true);
    else if(duration > 60 & duration <= 120) {
        var _diff = 120 - 60;
        return stepWiseCost(60) + cost(_diff, 3, true);
    }
    else if(duration > 120 & duration <= 180) {
        var _diff = 180 - 120;
        return stepWiseCost(120) + cost(_diff, 2, true);
    }
    else if(duration > 180) {
        var _diff = duration - 180;
        return stepWiseCost(180) + cost(_diff, 1, true);
    }
}

function perMinuteCost(duration, rate) {
    if (duration < 60)
        return rate;
    else if (duration % 60 == 0)
        return (duration / 60) * rate;
    else if (duration % 60 > 0)
        return (Math.floor(duration / 60) + 1) * rate;
}

function cost(duration, rate, perSecond) {
    if (perSecond)
        return perSecondCost(duration,rate);
    else
        return perMinuteCost(duration, rate);
}

function partialCallCost(startTime,endTime) {
    var tCall = new Call(startTime, timeBandOnDay(startTime, TUONGEE_END));
    return tCall.tuongeeCost();
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
            return this.costInBand(8, 22, true);
        }

        this.partialUwezoCost = function(startTime, endTime) {
            var _duration = diff(startTime, endTime);
            return cost(_duration, 4, true);
        }

        this.tuongeeCost = function() {
            if (this.whollyInBand(TUONGEE_START, TUONGEE_END)) {
                return stepWiseCost(this.duration());
            }
            else {
                if (!inBand(this.startTime, TUONGEE_START, TUONGEE_END)) {
                    return this.uwezoCost();
                }
                else if (!inBand(this.bestEndTime(), TUONGEE_START, TUONGEE_END)) {
                    var _tuongeeDuration = this.durationInBand(TUONGEE_START, TUONGEE_END);

                    var diff = this.duration() - _tuongeeDuration;
                    var tCost = stepWiseCost(diff);

                    tCost += this.partialUwezoCost(timeBandOnDay(this.startTime, TUONGEE_END), this.endTime);
                    return tCost;
                }
            }
        }

        this.costInBand = function(startHour, endHour, perSecond) {
            var _bandDuration = this.durationInBand(startHour, endHour);
            var _duration = this.duration();

            if (_duration == _bandDuration)
                return cost(_bandDuration, 4, perSecond);
            else if (_bandDuration == 0)
                return cost(_duration, 2, perSecond);
            else
                return cost(_bandDuration, 4, perSecond) + cost(_duration - _bandDuration, 2, perSecond);
        }

        this.bestEndTime = function() {
            return this.hasValidEndTime() ? this.endTime : new Date();
        }

        this.hasValidEndTime = function() {
            return !_.isUndefined(this.endTime) && this.endTime != null;
        }
    }
});
