(function ($) {

    $.fn.setInputSelection = function (startPos, endPos) {
        var input = $(this)[0];
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(startPos, endPos);
        } else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', endPos);
            range.moveStart('character', startPos);
            range.select();
        }
    };



    $.fn.getCursorPosition = function () {
        var input = this.get(0);
        if (!input) return; // No (input) element found
        if ('selectionStart' in input) {
            // Standard-compliant browsers
            return input.selectionStart;
        } else if (document.selection) {
            // IE
            input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    };

    $.fn.fancyDatePicker = function (options) {
        var settings = $.extend({
            selectedDate: undefined,
            onDayClick: undefined,
            handler: undefined,
            format: "mm/dd/yy",
            readOnly: false,
            useMask: true,
            closeOnSelect: true,
            culture: "en-US"
        }, options);
        $(this).each(function () {
            var cultureName = settings.culture.toLowerCase().replace("-", "");
            var culture = eval(cultureName);
            if (culture == undefined || culture === null) {
                culture = enus;
            }
            if (culture)
                culture = culture();


            var input = $(this);
            var inputFormat = settings.format;

            if (input.attr("format") != undefined && input.attr("format") != "")
                inputFormat = input.attr("format");


            var handler = settings.handler;
            var offset = input[0].getBoundingClientRect();
            /// lets create a handler
            if (settings.handler === undefined) {
                var inputcontainer = $("<div class='fancyDatePickerInputcontainer fancyDatePickerIdentifire'><div class='calanderBoxContainer fancyDatePickerIdentifire'><div class='calanderBox'></div></div></div>");
                inputcontainer.height(input.outerHeight(true));
                input.replaceWith(inputcontainer);
                inputcontainer.append(input);
                inputcontainer.find(".calanderBoxContainer").css({ left: (offset.width + (inputcontainer.find(".calanderBoxContainer").width() / 2) + 1) - inputcontainer.find(".calanderBoxContainer").outerWidth(true) * 1.4 });
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

                var char = inputFormat[2];
                var dateString = "";
                var stringSplitter = inputFormat.split(char);
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
                if (input.parent().find(".calanderBoxContainer").length > 0) {
                    if (orgBackGound == undefined)
                        orgBackGound = input.parent().find(".calanderBoxContainer").css("background");
                    if (timeout != undefined)
                        clearInterval(timeout);

                    timeout = setInterval(function () {
                        if (container != undefined && container.length > 0 && container.is(":visible"))
                            input.parent().find(".calanderBoxContainer").css({ background: "inherit" });
                        else {
                            input.parent().find(".calanderBoxContainer").css({ background: orgBackGound });
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

                $(".fancyDatePicker").remove();
                container = $('<div class="fancyDatePicker"></div>');
                $("body").append(container);

                var dayContainer = $('<div class="dayContainer"></div>');
                container.append(dayContainer);
                /// Header

                dayContainer.append("<div class='prev fancyDatePickerIdentifire'></div><div class='selectedMonth fancyDatePickerIdentifire'></div><div class='next fancyDatePickerIdentifire'></div>")
                dayContainer.find(".selectedMonth").html(culture.monthNames[settings.selectedDate.getMonth()] + " " + settings.selectedDate.getFullYear());
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
                $(culture.shortestDayNames).each(function () {
                    var day = $('<div dayName="' + this + '" class="day">' + this + '</div>');
                    day.width(dayContainer.width() / culture.shortestDayNames.length);
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
                    day.width(dayContainer.width() / culture.shortestDayNames.length);
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
                            settings.onDayClick(settings, SelectDate(true, date));

                        if (!settings.closeOnSelect)
                            BuildDate();
                    });
                    AddDay(day);

                });

                container.width((container.find(".dayContainer").last().find(".day").outerWidth(true) * 7) + 5);
                container.css({ top: offset.top + offset.height, left: offset.left });

                var dayContainer = $('<div class="dayContainer"></div>');
                var today = new Date();
                var todayString = culture.shortestDayNames[today.getDay()] + ", " + culture.monthNames[today.getMonth()] + " " + (today.getDate() > 9 ? today.getDate() : "0" + today.getDate()) + ", " + today.getFullYear();
                dayContainer.append("<div class='footer fancyDatePickerIdentifire'><div class='today fancyDatePickerIdentifire'>" + todayString + "</div></div>");

                dayContainer.click(function () {
                    settings.selectedDate = today;
                    SelectDate(false, today);
                    if (settings.onDayClick != undefined)
                        settings.onDayClick(settings, SelectDate(true, today));

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

            if (!settings.readOnly && settings.useMask) {
                $(this).unbind("click.fancyDatePicker");
                $(input).bind("click.fancyDatePicker", function () {
                    var start = input.getCursorPosition();
                    var end = start;
                    var value = input.val();
                    var char = inputFormat[2];
                    while (value[start] != char && start >= 0)
                        start--;
                    if (start < 0)
                        start = 0;
                    if (value[start] === char)
                        start++;
                    for (var i = start; i <= value.length; i++) {
                        if (value[end] === char)
                            break;
                        end++;
                    }
                    input.setInputSelection(start, end);
                });
            }

            if (settings.useMask) {
                var maskText = inputFormat.replace("yy", "yyyy").toLowerCase();
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
                    var start = input.getCursorPosition();
                    var key = event.keyCode == undefined ? event.which : event.keyCode;
                    var char = inputFormat[2];
                    var reg = eval("/[" + char + "]/g");
                    var value = input.val()
                    var dateString = "";
                    var stringSplitter = maskText.split(char);
                    var valueSplitter = [];
                    if (value.indexOf(char) != -1)
                        valueSplitter = value.split(char);
                    else valueSplitter.push(value)
                    if (valueSplitter.length == 1 && stringSplitter[0].length == valueSplitter[0].length && value.match(reg) === null) {
                        value += char
                        start++;
                    }
                    else if (valueSplitter.length == 2 && stringSplitter[1].length == valueSplitter[1].length && value.match(reg).length <= 1) {
                        value += char
                        start++;
                    }
                    else if (valueSplitter.length == 3 && stringSplitter[2].length == valueSplitter[2].length && value.match(reg).length < 2) {
                        value += char
                        start++;
                    }
                    if (value.length > maskText.length)
                        value = value.substring(0, value.length - 1);
                    result = value;
                    if (result != input.val() || (container != undefined && container.length > 0 && container.is(":visible") && SelectDate(true, settings.selectedDate) != result)) {
                        input.val(result);
                        if (container != undefined && container.length > 0 && container.is(":visible")) {
                            settings.selectedDate = undefined;
                            BuildDate();
                        }
                        input.setInputSelection(start, start);
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

    function enus() {

        var CultureInfo = {
            /* Culture Name */
            name: "en-US",
            englishName: "English (United States)",
            nativeName: "English (United States)",

            /* Day Name Strings */
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            abbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            shortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            firstLetterDayNames: ["S", "M", "T", "W", "T", "F", "S"],

            /* Month Name Strings */
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

            /* AM/PM Designators */
            amDesignator: "AM",
            pmDesignator: "PM",

            firstDayOfWeek: 0,
            twoDigitYearMax: 2029
        }

        return CultureInfo;
    }


    function engb() {

        var CultureInfo = {
            name: "en-GB",
            englishName: "English (United Kingdom)",
            nativeName: "English (United Kingdom)",

            /* Day Name Strings */
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            abbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            shortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            firstLetterDayNames: ["S", "M", "T", "W", "T", "F", "S"],

            /* Month Name Strings */
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

            /* AM/PM Designators */
            amDesignator: "AM",
            pmDesignator: "PM",

            firstDayOfWeek: 1,
            twoDigitYearMax: 2029,
        }

        return CultureInfo;
    }


    function svse() {

        var CultureInfo = {
            /* Culture Name */
            name: "sv-SE",
            englishName: "Swedish (Sweden)",
            nativeName: "svenska (Sverige)",

            /* Day Name Strings */
            dayNames: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"],
            abbreviatedDayNames: ["Sö", "Så", "Ti", "On", "To", "Fr", "Lö"],
            shortestDayNames: ["Sö", "Så", "Ti", "On", "To", "Fr", "Lö"],
            firstLetterDayNames: ["s", "m", "t", "o", "t", "f", "l"],

            /* Month Name Strings */
            monthNames: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
            abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],

            /* AM/PM Designators */
            amDesignator: "",
            pmDesignator: "",

            firstDayOfWeek: 1,
            twoDigitYearMax: 2029,
        }

        return CultureInfo;
    }




    function nbno() {

        var CultureInfo = {
            name: "nb-NO",
            englishName: "Norwegian, Bokmål (Norway)",
            nativeName: "norsk, bokmål (Norge)",

            /* Day Name Strings */
            dayNames: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
            abbreviatedDayNames: ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø"],
            shortestDayNames: ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø"],
            firstLetterDayNames: ["S", "M", "T", "O", "T", "F", "L"],

            /* Month Name Strings */
            monthNames: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
            abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],

            /* AM/PM Designators */
            amDesignator: "",
            pmDesignator: "",

            firstDayOfWeek: 1,
            twoDigitYearMax: 2029,
        }

        return CultureInfo;
    }

}(jQuery));
