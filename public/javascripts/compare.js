function Compare() {
//    $('#clock').stopwatch();
    var self = this;

    self.inProgess = ko.observable(false);

    $('#stopwatch').click(function() {
        var _before = self.inProgess();
        self.inProgess(!_before);
        var _after = self.inProgess();

        if (_after)
            self.startAnimation();
        else
            self.pauseAnimation();

    });

    self.timers = function() {
        return $('.timer .numbers');
    }

    self.startAnimation = function() {
        self.setAnimationState(self.timers(), "running");
    }

    self.pauseAnimation = function() {
        self.setAnimationState(self.timers(), "paused");
    }

    self.setAnimationState = function(item, state) {
        item.css("animation-play-state", state);
        item.css("-moz-animation-play-state", state);
        item.css("-webkit-animation-play-state", state);
        item.css("-o-animation-play-state", state);
    }

}

$(function() {
    ko.applyBindings(new Compare());
});

