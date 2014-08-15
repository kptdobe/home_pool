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
        },
        DOOR: {
            GARAGE: {
                API: "/garage/door",
                ID: "door_garage",
                VALUE_OFF: 1,
                VALUE_ON: 0
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

    var getDoorStatus = function(sensor) {
        $.get(sensor.API, null, function(data) {
            var door = $("#" + sensor.ID);

            var setStatus = function (value) {
                var setOff = function () {
                    door.addClass("label-default");
                    door.removeClass("label-warning");
                    door.html("Fermée");
                };

                var setOn = function () {
                    door.addClass("label-warning");
                    door.removeClass("label-default");
                    door.html("Ouverte");
                };

                if (value == sensor.VALUE_ON) {
                    setOn();
                } else {
                    setOff();
                }
            };
            setStatus(data);
        });
    };

    window.setTimeout(function() {
        getTemperature(config.TEMP.TEMP_POOL.ID);
        getTemperature(config.TEMP.TEMP_GARAGE.ID);
        getDoorStatus(config.DOOR.GARAGE);
    }, 1000);





});