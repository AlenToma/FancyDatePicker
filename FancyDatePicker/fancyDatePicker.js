(function(b){b.fn.fancyDatePicker=function(c){var d=b.extend({selectedDate:void 0,dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],onDayClick:void 0,handler:void 0,format:"mm/dd/yy",readOnly:!1,useMask:!0,closeOnSelect:!0},c);b(this).each(function(){function f(t,u){void 0==u&&(u=new Date);for(var z,v=i[2],w="",x=i.split(v),y=0;y!=x.length;)z=x[y].toLowerCase(),0<y&&(w+=v),"dd"==z&&(w+=9>=u.getDate()?"0"+u.getDate():u.getDate()),"mm"==z&&(w+=9>=u.getMonth()+1?"0"+(u.getMonth()+1):u.getMonth()+1),"yy"==z&&(w+=u.getFullYear()),y++;return t||(b(h).val(w),m.remove()),w}function g(t,u){function v(D,E){for(var F=11>D?-6:0,G=new Date(E,D,1<D?-3:1),H=[],I=new Date(E,D+1,0).getDate();11>D?G.getMonth()<=D:G.getMonth()<=D&&G.getDate()!=I;)H.push(new Date(G)),G.setDate(G.getDate()+1);for(;0>F;)H.push(new Date(G)),G.setDate(G.getDate()+1),F++;return H}function w(D){7===m.find(".dayContainer").last().find(".day").length&&m.append("<div class=\"dayContainer\"></div>"),D.width(y.width()/d.dayNames.length),m.find(".dayContainer").last().append(D)}0<h.parent().parent().find(".calanderBoxContainer").length&&(void 0==p&&(p=h.parent().parent().find(".calanderBoxContainer").css("background")),void 0!=o&&clearInterval(o),o=setInterval(function(){void 0!=m&&0<m.length&&m.is(":visible")?h.parent().parent().find(".calanderBoxContainer").css({background:"inherit"}):(h.parent().parent().find(".calanderBoxContainer").css({background:p}),clearInterval(o))},100)),t||(void 0===d.selectedDate&&1>=h.val().length?d.selectedDate=new Date:void 0===d.selectedDate&&(d.selectedDate=new Date(h.val()))),isNaN(d.selectedDate.getDate())&&(d.selectedDate=new Date);var x=[0,1,2,3,4,5,6];m.remove(),m=b("<div class=\"fancyDatePicker\"></div>"),b("body").append(m);var y=b("<div class=\"dayContainer\"></div>");m.append(y),y.append("<div class='prev fancyDatePickerIdentifire'></div><div class='selectedMonth fancyDatePickerIdentifire'></div><div class='next fancyDatePickerIdentifire'></div>"),y.find(".selectedMonth").html(d.monthNames[d.selectedDate.getMonth()]+" "+d.selectedDate.getFullYear()),y.find(".prev").click(function(){0<=d.selectedDate.getMonth()-1?d.selectedDate.setMonth(d.selectedDate.getMonth()-1):(d.selectedDate.setYear(d.selectedDate.getFullYear()-1),d.selectedDate.setMonth(11)),g(!0)}),y.find(".next").click(function(){11>=d.selectedDate.getMonth()+1?d.selectedDate.setMonth(d.selectedDate.getMonth()+1):(d.selectedDate.setYear(d.selectedDate.getFullYear()+1),d.selectedDate.setMonth(1)),g(!0)}),y=b("<div class=\"dayContainer\"></div>"),m.append(y),b(d.dayNames).each(function(){var D=b("<div dayName=\""+this+"\" class=\"day\">"+this.slice(0,2)+"</div>");D.width(y.width()/d.dayNames.length),y.append(D)}),y=b("<div class=\"dayContainer\"></div>"),m.append(y),void 0==n&&(n=d.selectedDate);var z=v(n.getMonth(),n.getFullYear()),A=b.grep(z,function(D){return D.setHours(0,0,0,0)==d.selectedDate.setHours(0,0,0,0)});0>=A.length&&(n=d.selectedDate,z=v(n.getMonth(),n.getFullYear())),b(z).each(function(){var D=this,E=this.getDate(),F=x[this.getDay()],G=m.find(".dayContainer").last().find(".day").length,H=b("<div date=\"\" class=\"day\">"+E+"</div>");this.getMonth()!=n.getMonth()&&H.addClass("notCurrentMonth"),this.setHours(0,0,0,0)==d.selectedDate.setHours(0,0,0,0)&&H.addClass("selectedDate"),H.click(function(){d.selectedDate=D,f(!1,D),void 0!=d.onDayClick&&d.onDayClick(d,f(!0,D)),d.closeOnSelect||g()}),w(H)}),m.width(7*m.find(".dayContainer").last().find(".day").outerWidth(!0)+5),m.css({top:k.top+k.height,left:k.left});var y=b("<div class=\"dayContainer\"></div>"),B=new Date,C=d.dayNames[B.getDay()]+", "+d.monthNames[B.getMonth()]+" "+(9<B.getDate()?B.getDate():"0"+B.getDate())+", "+B.getFullYear();y.append("<div class='footer fancyDatePickerIdentifire'><div class='today fancyDatePickerIdentifire'>"+C+"</div></div>"),y.click(function(){d.selectedDate=B,f(!1,B),void 0!=d.onDayClick&&d.onDayClick(d,f(!0,B)),d.closeOnSelect||g()}),m.append(y),u&&m.hide().slideDown(300)}var h=b(this),i=d.format;void 0!=h.attr("format")&&""!=h.attr("format")&&(i=h.attr("format"));var j=d.handler,k=h[0].getBoundingClientRect();if(void 0===d.handler){var l=b("<div class='fancyDatePickerInputcontainer fancyDatePickerIdentifire'><div class='calanderBoxContainer fancyDatePickerIdentifire'><div class='calanderBox'></div></div></div>");l.height(h.outerHeight(!0)),h.replaceWith(l),l.append(h),l.find(".calanderBoxContainer").css({left:k.left+k.width+1-1.4*l.find(".calanderBoxContainer").outerWidth(!0)}),j=l.find(".calanderBox")}h.addClass("fancyDatePickerIdentifire"),d.readOnly&&h.attr("readonly","readonly"),void 0==j&&(d.handler=b(this)),void 0!=h.attr("handler")&&""!=h.attr("handler")&&(j=b(h.attr("handler"))),j.addClass("fancyDatePickerIdentifire");var n,o,p,m=b("<div class=\"fancyDatePicker\"></div>");if(b(this).unbind("click.fancyDatePicker"),b(j).bind("click.fancyDatePicker",function(){n=void 0,g(void 0,!0)}),d.readOnly||(b(this).unbind("focus.fancyDatePicker"),b(h).bind("focus.fancyDatePicker",function(){h.select()})),d.useMask){var r,q=i.replace("yy","yyyy").toLowerCase(),s=!1;h.unbind("keypress.fancyDatePicker"),h.bind("keydown.fancyDatePicker",function(t){return s?(t.preventDefault(),!1):void(s=!0)}),h.unbind("keyup.fancyDatePicker"),h.bind("keyup.fancyDatePicker",function(t){var u=void 0==t.keyCode?t.which:t.keyCode;if(46==u||8==u)return s=!1,!0;var u=void 0==t.keyCode?t.which:t.keyCode,v=i[2],w=h.val(),y=q.split(v),z=[];-1==w.indexOf(v)?z.push(w):z=w.split(v),1==z.length&&y[0].length==z[0].length?w+=v:2==z.length&&y[1].length==z[1].length?w+=v:3==z.length&&y[2].length==z[2].length&&(w+=v),w.length>q.length&&(w=w.substring(0,w.length-1)),r=w,(r!=h.val()||void 0!=m&&0<m.length&&m.is(":visible")&&f(!0,d.selectedDate)!=r)&&(h.val(r),void 0!=m&&0<m.length&&m.is(":visible")&&(d.selectedDate=void 0,g())),s=!1}),h.attr("placeholder",q.replace(/y/g,"_").replace(/d/g,"_").replace(/m/g,"_"))}b(document).click(function(t){var u=b(t.target);u.hasClass("fancyDatePickerIdentifire")||u.hasClass("day")||u.hasClass("dayContainer")||u.hasClass("fancyDatePicker")||(m.slideUp(200,function(){m.remove()}),d.selectedDate=void 0,n=void 0)})})}})(jQuery);
