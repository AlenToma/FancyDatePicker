(function ($) {
    $.fn.fancyDatePicker = function (options) {
        var settings = $.extend({
            selectedDate: undefined,
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            onDayClick: undefined,
            handler: undefined,
            format: "mm/dd/yy",
            readOnly: false,
            useMask: true,
            closeOnSelect: true,
        }, options);
        $(this).each(function () {
            var input = $(this);
            if (input.attr("format") != undefined && input.attr("format") != "")
                settings.format = input.attr("format");


            var handler = settings.handler;
            var offset = input[0].getBoundingClientRect();
            /// lets create a handler
            if (settings.handler === undefined) {
                var inputcontainer = $("<div class='fancyDatePickerInputcontainer fancyDatePickerIdentifire'><div class='calanderBoxContainer fancyDatePickerIdentifire'><div class='calanderBox'></div></div></div>");
                inputcontainer.height(input.outerHeight(true));
                input.replaceWith(inputcontainer);
                inputcontainer.append(input);
                inputcontainer.find(".calanderBoxContainer").css({ left: (offset.left + offset.width + 1) - inputcontainer.find(".calanderBoxContainer").outerWidth(true) * 1.4 })
                handler = inputcontainer.find(".calanderBox");
            }

            input.addClass("fancyDatePickerIdentifire");
            if (settings.readOnly)
                input.attr("readonly", "readonly");

            if (handler == undefined)
                settings.handler = $(this);

    

            if (input.attr("handler") != undefined && input.attr("handler") != "")
                handler = $(input.attr("handler"));

            handler.addClass("fancyDatePickerIdentifire");
            var container = $('<div class="fancyDatePicker"></div>');

            function SelectDate(getOnly, date) {
                if (date == undefined)
                    date = new Date();

                var char = settings.format[2];
                var dateString = "";
                var stringSplitter = settings.format.split(char);
                var counter = 0;
                while (counter != stringSplitter.length) {
                    var str = stringSplitter[counter].toLowerCase();
                    if (counter > 0)
                        dateString += char;

                    if (str == "dd")
                        dateString += date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();

                    if (str == "mm")
                        dateString += date.getMonth() + 1 <= 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);

                    if (str == "yy")
                        dateString += date.getFullYear();

                    counter++;

                }
                if (!getOnly) {
                    $(input).val(dateString);
                    container.remove();
                }
                return dateString;
            }

            var now = undefined;
            var timeout = undefined;
            var orgBackGound = undefined;
            function BuildDate(staticDate, slow) {
                if (input.parent().parent().find(".calanderBoxContainer").length > 0) {
                    if (orgBackGound == undefined)
                        orgBackGound = input.parent().parent().find(".calanderBoxContainer").css("background");
                    if (timeout != undefined)
                        clearInterval(timeout);

                    timeout = setInterval(function () {
                        if (container != undefined && container.length > 0 && container.is(":visible"))
                            input.parent().parent().find(".calanderBoxContainer").css({ background: "inherit" });
                        else {
                            input.parent().parent().find(".calanderBoxContainer").css({ background: orgBackGound });
                            clearInterval(timeout);
                        }
                    }, 100);
                }

                if (!staticDate) {
                    if (settings.selectedDate === undefined && input.val().length <= 1)
                        settings.selectedDate = new Date();
                    else if (settings.selectedDate === undefined)
                        settings.selectedDate = new Date(input.val());

                }

                if (isNaN(settings.selectedDate.getDate()))
                    settings.selectedDate = new Date();

                var dateNum = [0, 1, 2, 3, 4, 5, 6]
                function getDaysInMonth(month, year) {
                    var day = (month < 11 ? -6 : 0);
                    var date = new Date(year, month, (month > 1 ? -3 : 1));
                    var days = [];
                    var lastDayInMonth = new Date(year, month + 1, 0).getDate();

                    while ((month < 11 ? date.getMonth() <= month : (date.getMonth() <= month && date.getDate() != lastDayInMonth))) {
                        days.push(new Date(date));
                        date.setDate(date.getDate() + 1);
                    }

                    while (day < 0) {
                        days.push(new Date(date));
                        date.setDate(date.getDate() + 1);
                        day++;
                    }
                    return days;
                }

                container.remove();
                container = $('<div class="fancyDatePicker"></div>');
                $("body").append(container);

                var dayContainer = $('<div class="dayContainer"></div>');
                container.append(dayContainer);
                /// Header

                dayContainer.append("<div class='prev fancyDatePickerIdentifire'></div><div class='selectedMonth fancyDatePickerIdentifire'></div><div class='next fancyDatePickerIdentifire'></div>")
                dayContainer.find(".selectedMonth").html(settings.monthNames[settings.selectedDate.getMonth()] + " " + settings.selectedDate.getFullYear());
                dayContainer.find(".prev").click(function () {
                    if (settings.selectedDate.getMonth() - 1 >= 0)
                        settings.selectedDate.setMonth(settings.selectedDate.getMonth() - 1);
                    else {
                        settings.selectedDate.setYear(settings.selectedDate.getFullYear() - 1);
                        settings.selectedDate.setMonth(11);
                    }
                    BuildDate(true);
                });

                dayContainer.find(".next").click(function () {
                    if (settings.selectedDate.getMonth() + 1 <= 11)
                        settings.selectedDate.setMonth(settings.selectedDate.getMonth() + 1);
                    else {
                        settings.selectedDate.setYear(settings.selectedDate.getFullYear() + 1);
                        settings.selectedDate.setMonth(1);
                    }
                    BuildDate(true);
                });


                dayContainer = $('<div class="dayContainer"></div>');
                container.append(dayContainer);
                /// Days
                $(settings.dayNames).each(function () {
                    var day = $('<div dayName="' + this + '" class="day">' + this.slice(0, 2) + '</div>');
                    day.width(dayContainer.width() / settings.dayNames.length);
                    dayContainer.append(day);
                });

                dayContainer = $('<div class="dayContainer"></div>');
                container.append(dayContainer);
                if (now == undefined)
                    now = settings.selectedDate;
                var days = getDaysInMonth(now.getMonth(), now.getFullYear());
                var exist = $.grep(days, function (a) { return a.setHours(0, 0, 0, 0) == settings.selectedDate.setHours(0, 0, 0, 0) });
                if (exist.length <= 0) {
                    now = settings.selectedDate;
                    days = getDaysInMonth(now.getMonth(), now.getFullYear());
                }

                function AddDay(day) {
                    if (container.find(".dayContainer").last().find(".day").length === 7) {
                        container.append('<div class="dayContainer"></div>');
                    }
                    day.width(dayContainer.width() / settings.dayNames.length);
                    container.find(".dayContainer").last().append(day);
                }

                $(days).each(function () {
                    var date = this;
                    var dayNum = (this.getDate());
                    var dayName = dateNum[this.getDay()];
                    var tempDay = container.find(".dayContainer").last().find(".day").length;
                    var day = $('<div date="" class="day">' + (dayNum) + '</div>');
                    if (this.getMonth() != now.getMonth())
                        day.addClass("notCurrentMonth");

                    if (this.setHours(0, 0, 0, 0) == settings.selectedDate.setHours(0, 0, 0, 0))
                        day.addClass("selectedDate");
                    day.click(function () {
                        settings.selectedDate = date;
                        SelectDate(false, date);
                        if (settings.onDayClick != undefined)
                            onDayClick(settings, SelectDate(true, date));

                        if (!settings.closeOnSelect)
                            BuildDate();
                    });
                    AddDay(day);

                });

                container.width((container.find(".dayContainer").last().find(".day").outerWidth(true) * 7) + 5);
                container.css({ top: offset.top + offset.height, left: offset.left });

                var dayContainer = $('<div class="dayContainer"></div>');
                var today = new Date();
                var todayString = settings.dayNames[today.getDay()] + ", " + settings.monthNames[today.getMonth()] + " " + (today.getDate() > 9 ? today.getDate() : "0" + today.getDate()) + ", " + today.getFullYear();
                dayContainer.append("<div class='footer fancyDatePickerIdentifire'><div class='today fancyDatePickerIdentifire'>" + todayString + "</div></div>");

                dayContainer.click(function () {
                    settings.selectedDate = today;
                    SelectDate(false, today);
                    if (settings.onDayClick != undefined)
                        onDayClick(settings, SelectDate(true, today));

                    if (!settings.closeOnSelect)
                        BuildDate();
                });
                container.append(dayContainer);

                if (slow)
                    container.hide().slideDown(300);

            }
            /// assigning Handler
            $(this).unbind("click.fancyDatePicker");
            $(handler).bind("click.fancyDatePicker", function () {
                now = undefined;
                BuildDate(undefined, true);

            });

            if (!settings.readOnly) {
                $(this).unbind("focus.fancyDatePicker");
                $(input).bind("focus.fancyDatePicker", function () {
                    input.select();
                });
            }

            if (settings.useMask) {
                var maskText = settings.format.replace("yy", "yyyy").toLowerCase();
                var result;
                var keyisDown = false;
                input.unbind("keypress.fancyDatePicker");
                input.bind("keydown.fancyDatePicker", function (event) {

                    if (keyisDown) {
                        event.preventDefault();
                        return false;
                    }
                    keyisDown = true;
                });


                input.unbind("keyup.fancyDatePicker");
                input.bind("keyup.fancyDatePicker", function (event) {
                    var key = event.keyCode == undefined ? event.which : event.keyCode;
                    if (key == 46 || key == 8) {
                        keyisDown = false;
                        return true;
                    }

                    var key = event.keyCode == undefined ? event.which : event.keyCode;
                    var char = settings.format[2];
                    var value = input.val()
                    var dateString = "";
                    var stringSplitter = maskText.split(char);
                    var valueSplitter = [];
                    if (value.indexOf(char) != -1)
                        valueSplitter = value.split(char);
                    else valueSplitter.push(value)
                    if (valueSplitter.length == 1 && stringSplitter[0].length == valueSplitter[0].length)
                        value += char
                    else if (valueSplitter.length == 2 && stringSplitter[1].length == valueSplitter[1].length)
                        value += char;
                    else if (valueSplitter.length == 3 && stringSplitter[2].length == valueSplitter[2].length)
                        value += char;
                    if (value.length > maskText.length)
                        value = value.substring(0, value.length - 1);
                    result = value;
                    if (result != input.val() || (container != undefined && container.length > 0 && container.is(":visible") && SelectDate(true, settings.selectedDate) != result)) {
                        input.val(result);
                        if (container != undefined && container.length > 0 && container.is(":visible")) {
                            settings.selectedDate = undefined;
                            BuildDate();
                        }

                    }
                    keyisDown = false;
                });
                input.attr("placeholder", maskText.replace(/y/g, "_").replace(/d/g, "_").replace(/m/g, "_"));
            }

            $(document).click(function (e) {
                var target = $(e.target);
                if (!target.hasClass("fancyDatePickerIdentifire") && !target.hasClass("day") && !target.hasClass("dayContainer") && !target.hasClass("fancyDatePicker")) {
                    container.slideUp(200, function () {
                        container.remove();
                    })
                    settings.selectedDate = undefined;
                    now = undefined;
                }
            });
        });
    };

}(jQuery));
