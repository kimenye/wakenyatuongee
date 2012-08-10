$(function () {
    function App() {
        var self = this;
        this.inProgress = ko.observable(false);
        this.chart = null;
        this.timer = null;
        this.startTime = null;
        this.endTime = ko.observable(null);

        this.startTimer = function() {
            if (!this.inProgress()) {
                this.startTime = new Date();
                this.inProgress(true);
                this.startAnimation();
            }
        }

        this.endTimer = function() {
            this.endTime(new Date());
            self.inProgress(false);
            self.pauseAnimation();
        };

        this.uwezoCost = ko.computed(function() {
            var call = new Call(self.startTime, self.endTime());
            if (call.isValid()) {
                return formatCurrency(call.uwezoCost());
            }
        });

        this.tuongeeCost = ko.computed(function() {
            var call = new Call(self.startTime, self.endTime());
            if (call.isValid()) {
                return formatCurrency(call.tuongeeCost());
            }
        });

        this.duration = ko.computed(function() {
            var call = new Call(self.startTime, self.endTime());
            if (call.isValid())
                return formatDuration(call.duration());
        })

        self.timers = function() {
            return $('.timer .numbers');
        }

        self.startAnimation = function() {
            self.setAnimationState(self.timers(), "running");
            self.timer = setInterval(self.tick, 1000);
            if (!self.paused)
                self.drawChart();
        }

        self.tick = function() {
            self.endTime(new Date());
        }

        this.pauseAnimation = function() {
            self.setAnimationState(self.timers(), "paused");
            clearInterval(self.timer);
            this.drawChart()
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

        this.drawChart = function() {


            //    var chart = new Highcharts.Chart({
//        chart: {
//            renderTo: 'chart',
//            marginRight: 80
//        },
//        xAxis: {
//            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//        },
//        yAxis: [{
//            title: {
//                text: 'Temperature'
//            }
//        }, {
//            title: {
//                text: 'Rainfall'
//            },
//            opposite: true
//        }],
//
//        series: [{
//            type: 'line',
//            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
//            name: 'Temperature'
//        }, {
//            type: 'line',
//            data: [194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4],
//            name: 'Rainfall',
//            yAxis: 1
//        }]
//    });

        };

        this.refreshChart = function() {

        }
    }

    ko.applyBindings(new App());
});

//$(function () {
//    var chart = new Highcharts.Chart({
//        chart: {
//            renderTo: 'chart',
//            marginRight: 80
//        },
//        xAxis: {
//            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//        },
//        yAxis: [{
//            title: {
//                text: 'Temperature'
//            }
//        }, {
//            title: {
//                text: 'Rainfall'
//            },
//            opposite: true
//        }],
//
//        series: [{
//            type: 'line',
//            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
//            name: 'Temperature'
//        }, {
//            type: 'line',
//            data: [194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4],
//            name: 'Rainfall',
//            yAxis: 1
//        }]
//    });
//});
//$(function() {
//
//    Highcharts.setOptions({
//        global: {
//            useUTC: false
//        }
//    });
//
//    var chart;
//    var start = new Date();
//    var call = new Call(start);
//    var cost = 4;
//    chart = new Highcharts.Chart({
//        chart:{
//            renderTo:'chart',
//            type:'spline',
//            marginRight:10,
//            events:{
//                load:function () {
//
//                    // set up the updating of the chart each second
//                    var series = this.series[0];
//                    var seriesb = this.series[1];
//                    setInterval(function () {
////                        cost += 4;
//                        var cost = call.uwezoCost();
//                        var x = (new Date()).getTime(), // current time
//                            y = cost;
//                        series.addPoint([x, y], true, true);
//                        seriesb.addPoint([x, y+1], true, true);
//
//
//
//                    }, 1000);
//                }
//            }
//        },
//        title:{
//            text:'Uwezo Tarriff vs Wakenya Tuongee'
//        },
//        xAxis:{
//            type:'datetime',
//            tickPixelInterval:150,
//            title: {
//                text: 'How much have I been talking for?'
//            }
//        },
//        yAxis:[{
//            title:{
//                text:'How much (kshs)?'
//            }
//        },{
//            title: {
//                text: 'How much in Tuongee?',
//
//            },
//            opposite: true
//        }],
//        tooltip:{
//            formatter:function () {
//                return '<b>' + this.series.name + '</b><br/>' +
//                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
//                    Highcharts.numberFormat(this.y, 2);
//            }
//        },
//        legend:{
//            enabled:false
//        },
//        exporting:{
//            enabled:false
//        },
//        series:[
//            {
//                name:'Uwezo Tariff',
//                data:(function () {
//                    // generate an array of random data
//                    start.getTime()
//                    var data = [],
//                        time = start.getTime(),
//                        i;
//
//                    for (i = -1; i <= 0; i++) {
//                        data.push({
//                            x:time + i * 1000,
//                            y:0
//                        });
//                    }
//                    return data;
//                })()
//            },
//            {
//                name:'Wakenya Tuongee',
//                type: 'line',
//                data:(function () {
//                    // generate an array of random data
//                    start.getTime()
//                    var data = [],
//                        time = start.getTime(),
//                        i;
//
//                    for (i = -1; i <= 0; i++) {
//                        data.push({
//                            x:time + i * 1000,
//                            y:1
//                        });
//                    }
//                    return data;
//                })()
//            }
//        ]
//    });
//
//    console.log("Finished setting up Highcharts data");
//});
//
//
//
//
