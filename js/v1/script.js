$(function() {

    var getValueRESTUrl = function(gpio) {
        return "/GPIO/"+gpio+"/value";
    };

    var postValueRESTUrl = function(gpio, value) {
        return "/GPIO/"+gpio+"/value/"+value;
    };

    var normalize = function(value) {
        return parseInt(value);
    };

    var not = function(value) {
        var v = normalize(value);
        return v == 1 ? 0 : 1;
    };

    var config = {
        LIGHT: {
            GPIO: 2,
            VALUE_OFF: 1,
            VALUE_ON: 0
        },
        TEMP: {
            TEMP_POOL: {
                ID: "temp_pool"
            },
            TEMP_GARAGE: {
                ID: "temp_garage"
            }
        }
    };

    $.get(getValueRESTUrl(config.LIGHT.GPIO), null, function(data) {
        var light = $(".btn-pool-light");
        light.data("value",normalize(data));

        var setLight = function (value) {

            var setLightOff = function () {
                light.addClass("btn-default");
                light.removeClass("btn-warning");
                light.html("Allumer");
            };

            var setLightOn = function () {
                light.addClass("btn-warning");
                light.removeClass("btn-default");
                light.html("Eteindre");
            };

            if (value == config.LIGHT.VALUE_ON) {
                setLightOn();
            } else {
                setLightOff();
            }
        };

        setLight(light.data("value"));

        light.on("click tap", function() {
            $.post(postValueRESTUrl(config.LIGHT.GPIO, not(light.data("value"))), null, function(data) {
                var value = normalize(data);
                light.data("value",value);

                setLight(value);
            });
        });


    });

    var getTemperature = function(sensor) {
        $.get("/devices/"+sensor+"/sensor/temperature/c", null, function(data) {
            $("#" + sensor).html(data + " ºC");
        });
    };

    window.setTimeout(function() {
        getTemperature(config.TEMP.TEMP_POOL.ID);
        getTemperature(config.TEMP.TEMP_GARAGE.ID);
    }, 1000);

});