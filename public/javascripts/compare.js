
function Compare() {
    var self = this;

    self.inProgess = ko.observable(false);
    self.seconds = ko.observable(0);
    self.timer = null;

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
    }

    self.tick = function() {
        self.seconds(self.seconds() + 1);
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

}

$(function() {
    ko.applyBindings(new Compare());
});

