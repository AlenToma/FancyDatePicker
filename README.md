# FancyDatePicker is a small plugin for Time, Date or DateTime picker using only jquary

## Demo

https://codepen.io/AlenToma/pen/owXYKj?editors=0100

## How to Use

```
<input type="text" class="sv" />
$(".sv").fancyDatePicker({
    closeOnSelect: true,
    useTime: true, // this indicate a date and time picker
    timeOnly: false, // true for only time
    useMask: true, // use text mask
    culture:"en-US",/// need to upload globalization maps to use aditional languages, se globalization mapp
    format: "mm/dd/yy", // use culture or override the culture format.
    onDayClick: function(settings, dateString){
       $(".res").html("")
      $(".res").append("<div>StringResult:" + dateString +"<br></div>");
       $(".res").append("<div>DateResult:" + settings.selectedDate +"</div>");
    }
  });

```
