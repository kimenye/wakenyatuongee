var Call = JS.Class({
    construct:function (json) {
        this.type = json["Call Type"];
        this.callDate = json["Call Date"];
        this.duration = json.Duration;
        this.isOutGoing = this.type == "OUTGOING";
    }
});


function App() {
    var self = this;
    this.calls = ko.observableArray([]);


    $.ajax({
        type:"GET",
        url:"/log",
        success:function (data) {
            if (_.isArray(data)) {
                var models = [];
                _.each(data, function (item) {
                    models.push(new Call(item));
                });
                self.calls(models);
            }
        }
    });

}

ko.applyBindings(new App());

