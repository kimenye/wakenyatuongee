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