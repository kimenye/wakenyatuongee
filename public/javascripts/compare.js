var Unit = JS.Class({
    construct:function (duration) {
        this.duration = duration;
        this.at = new Date();
        this.cost = function() {
            return 0;
        };
    }
});

var UwezoUnit = Unit.extend({
    construct: function(duration) {
        this.parent.construct.apply(this, [duration]);
        this.startHour = 8;
        this.endHour = 22;
    }
});

var TuongeeUnit = Unit.extend({
    construct: function(duration) {
        this.parent.construct.apply(this, [duration]);
        this.startHour = 6;
        this.endHour = 18;
    }
});

function Compare() {
    var self = this;

    self.inProgess = ko.observable(false);
    self.seconds = ko.observable(0);
    self.timer = null;
    self.uwezoUnits = ko.observableArray([]);
    self.tuongeeUnits = ko.observableArray([]);
    self.chartIsReady = ko.observable(false);
    self.chart = null;
    self.title = "Uwezo Tarriff vs Wakenya Tuongee";

    $('#stopwatch').click(function() {
        var _before = self.inProgess();
        console.log("in click to " + !_before);
        self.inProgess(!_before);
        var _after = self.inProgess();

        if (_after)
            self.startAnimation();
        else
            self.pauseAnimation();
    });

    $('#stopwatch').dblclick(function() {
//        self.inProgess(false);
//        self.stopAnimation();
    })

    self.timers = function() {
        return $('.timer .numbers');
    }

    self.startAnimation = function() {
        self.setAnimationState(self.timers(), "running");
        self.timer = setInterval(self.tick, 1000);
        self.drawChart();
    }

    self.tick = function() {
        self.seconds(self.seconds() + 1);
        self.uwezoUnits.push(new UwezoUnit(self.seconds()));
        self.uwezoUnits.push(new TuongeeUnit(self.seconds()));
    }

    self.pauseAnimation = function() {
        self.setAnimationState(self.timers(), "paused");
        clearInterval(self.timer);
    }

    self.stopAnimation = function() {
        self.resetAnimation(self.timers(), "none");
    }

    self.setAnimationState = function(item, state) {
        item.css("animation-play-state", state);
        item.css("-moz-animation-play-state", state);
        item.css("-webkit-animation-play-state", state);
        item.css("-o-animation-play-state", state);
    }

    self.resetAnimation = function(item) {
        item.css("animation", "none");
        item.css("-moz-animation", "none");
        item.css("-webkit-animation", "none");
        item.css("-o-animation", "none");
    }



    self.drawChart = function() {
        console.log("chart is ready ", self.chartIsReady());
        if (self.chartIsReady()) {
            this.chart = new google.visualization.LineChart(document.getElementById('timeline'));
            var _options = { title: this.title };

            var data = google.visualization.arrayToDataTable([
                ['Time', 'Uwezo', 'Wakenya Tuongee']
            ]);
            this.chart.draw(data,options);
        }
    }

    self.chartReady = function() {
        console.log("Chart is ready");
        self.chartIsReady(true);
    }

    self.initChart = function() {
        google.load("visualization", "1", {packages:["corechart"]});
        google.setOnLoadCallback(self.chartReady);
    }
//    self.initChart();

}

$(function() {
    ko.applyBindings(new Compare());
});

