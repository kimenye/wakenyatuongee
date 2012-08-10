/**
 * Test functions for timer.js
 */

//helper functions



describe("Charging Rules:", function() {


    beforeEach(function() {
    });

    it("When a call is created with the start and end time, it is marked as complete", function() {
        var _call = new Call(new Date());
        expect(_call.inProgress()).toBe(true);

        _call = new Call(new Date(), new Date());
        expect(_call.inProgress()).toBe(false);
    });

    it("The call duration is the difference in seconds from the start of the call to the end of the call", function() {
        var _start = Date.today().set({ hour: 8, minute: 30, second: 0 });
        var _end = Date.today().set({ hour: 8, minute: 35, second: 0 });
        var _call = new Call(_start, _end);

        expect(_call.duration()).toBe(300);
    });

    it("A time is in the uwezo timeband", function() {
        var _time = Date.today().set({ hour: 8, minute: 30, second: 0});
        expect(inUwezoTimeBand(_time)).toBe(true);

        _time = Date.today().set({ hour: 23, minute: 30, second: 0 });
        expect(inUwezoTimeBand(_time)).toBe(false);
    });

    it("A time is in the tuongee timeband", function() {
        var _time = Date.today().set({ hour: 6, minute: 0, second: 59});
        expect(inTuongeeTimeband(_time)).toBe(true);

        _time = Date.today().set({ hour: 19, minute: 0, second: 56 });
        expect(inTuongeeTimeband(_time)).toBe(false);
    });


    it("Returns the uwezo start on a particular day", function() {
        // returns Jul 15 2008 18:45:30
        var date = Date.today().set({
            millisecond: 500,
            second: 30,
            minute: 45,
            hour: 18,
            day: 15,
            month: 6,
            year: 2008
        });

        var uwezoStart = uwezoStartOnDay(date);
        expect(uwezoStart.getDate()).toEqual(15);
        expect(uwezoStart.getSeconds()).toEqual(0);
    });


    it("If a call is wholly in Uwezo timeband then its duration is equal to the uwezo duration", function() {
        var start = Date.today().set({ hour: 8, minute: 30, second: 0 });
        var end = Date.today().set({ hour: 8, minute: 40, second: 0 });
        var call = new Call(start, end);
        var duration = call.duration();
        var uwezo_duration = call.durationInUwezo();

        expect(duration).toEqual(uwezo_duration);

        var other_end = Date.today().set({ hour: 23, minute: 15, second: 0 });
        call = new Call(start, other_end);
        expect(call.duration()).not.toEqual(call.durationInUwezo());
    });

    it("If a call is not wholly in the uwezo timeband then the uwezo duration is equal to the duration within the timeband", function() {
        var start = Date.today().set({ hour: 7, minute: 59, second: 0 });
        var end = Date.today().set({ hour: 8, minute: 1, second: 0 });

        var call = new Call(start, end);
        expect(call.duration()).toEqual(120);
        expect(call.durationInUwezo()).toEqual(60);

        start = Date.today().set({ hour: 21, minute: 59, second: 0 });
        end = Date.today().set({ hour: 22, minute: 1, second: 0 });

        call = new Call(start, end);
        expect(call.duration()).toEqual(120);
        expect(call.durationInUwezo()).toEqual(60);
    });

    it ("If a call is completely not in the uwezo timeband then the uwezo duration for that call is zero", function() {
        var start = Date.today().set({ hour: 23, minute: 21, second: 0});
        var end = Date.today().set({ hour: 23, minute: 21, second: 30});

        var call = new Call(start, end);

        expect(call.durationInUwezo()).toEqual(0);
    });

    it ("If a call starts before the timeband and ends after the timeband then the uwezo timeband duration is the full timeband duration", function() {
        var start = Date.today().set({ hour: 7, minute: 59, second: 0});
        var end = Date.today().set({ hour: 23, minute: 1, second: 0});

        var call = new Call(start, end);
        expect(call.durationInUwezo()).toEqual(14 * 3600);
    });

    it("The cost of a call in per second billing is the product of the cost per minute divided by number of seconds", function() {
        expect(perSecondCost(60,4)).toEqual(4);
        expect(perSecondCost(240, 4)).toEqual(16);
        expect(perSecondCost(30, 4)).toEqual(2);
    });

    it("The cost of a call in per minute billing is the the product of the number of minutes and the rate", function() {
        expect(perMinuteCost(240, 4)).toEqual(16);
        expect(perMinuteCost(30, 4)).toEqual(4);
        expect(perMinuteCost(61, 4)).toEqual(8);
    });

    it("The cost of a call is equal to the cost of the call multiplied by the duration in the band", function() {
        var start = Date.today().set({ hour: 8, minute: 30, second: 0 });
        var end = Date.today().set({ hour: 8, minute: 40, second: 0 });
        var call = new Call(start, end);

        expect(call.uwezoCost()).toEqual(40);

        start = Date.today().set({ hour: 22, minute: 30, second: 0 });
        end = Date.today().set({ hour: 22, minute: 40, second: 0 });
        call = new Call(start, end);

        expect(call.uwezoCost()).toEqual(20);

        start = Date.today().set({ hour: 7, minute: 59, second: 0 });
        end = Date.today().set({ hour: 8, minute: 1, second: 0 });
        call = new Call(start, end);

        expect(call.uwezoCost()).toEqual(6);

        start = Date.today().set({ hour: 21, minute: 59, second: 0 });
        end = Date.today().set({ hour: 22, minute: 1, second: 0 });
        call = new Call(start, end);

        expect(call.uwezoCost()).toEqual(6);
    });


//    it("The cost of an off peak call in uwe")
});


(function() {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;

    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    var currentWindowOnload = window.onload;
    window.onload = function() {
        if (currentWindowOnload) {
            currentWindowOnload();
        }

        document.querySelector('.version').innerHTML = jasmineEnv.versionString();
        execJasmine();
    };

    function execJasmine() {
        jasmineEnv.execute();
    }
})();