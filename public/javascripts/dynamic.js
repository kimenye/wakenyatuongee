$(function() {

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    var chart;
    chart = new Highcharts.Chart({
        chart:{
            renderTo:'chart',
            type:'spline',
            marginRight:10,
            events:{
                load:function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    var series2 = this.series[1];
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.random();
                        series.addPoint([x, y], true, true);
                        series2.addPoint([x, y+20], true, true);


                    }, 1000);
                }
            }
        },
        title:{
            text:'Live random data'
        },
        xAxis:{
            type:'datetime',
            tickPixelInterval:150
        },
        yAxis:{
            title:{
                text:'Value'
            },
            plotLines:[
                {
                    value:0,
                    width:1,
                    color:'#808080'
                },
                {
                    value:0,
                    width:2,
                    color:'#808080'
                }
            ]
        },
        tooltip:{
            formatter:function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend:{
            enabled:false
        },
        exporting:{
            enabled:false
        },
        series:[
            {
                name:'Random data',
                data:(function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x:time + i * 1000,
                            y:Math.random()
                        });
                    }
                    return data;
                })()
            },
            {
                name:'Random 2',
                data:(function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x:time + i * 1000,
                            y:Math.random()
                        });
                    }
                    return data;
                })()
            }
        ]
    });

    console.log("Finished setting up Highcharts data");
});



