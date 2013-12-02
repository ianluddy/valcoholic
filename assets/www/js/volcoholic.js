var drinks_toggled = false;
var imgdown, imgup, header, menu, table, header_header, overlay;
var qua, vol, str, cos;
var quaval, volval, strval, cosval;
var quastep, volstep, strstep, cosstep;
var unit = "ml";
var placeholder, cost_buffer;
var drinks = [];
var max_alcohol_mils = 0;
var width_step = 325;
var units = {
    "ml"  :{"max":990,"step":10,"min":10},
    "l"   :{"max":10,"step":0.1,"min":0.1},
    "cl"  :{"max":200,"step":1,"min":1},
    "oz"  :{"max":100,"step":1,"min":1},
};

// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    setTimeout(function(){navigator.splashscreen.hide();},1200);
    document.addEventListener("backbutton", function(){
        if(drinks_toggled){
            toggleDrinks();
        }else{
            navigator.app.exitApp();
        }
    }, true);
}

function Drink(){
	this.strength = null;
    this.volume = null;
    this.unit = null;
    this.cost = null;
    this.quantity = null;
    this.index = null;
}

function onLoad(){

    // Headers
    imgdown = $("#imgdown");
    imgup = $("#imgup");
	header_header = $("#header");
	overlay = $("#overlay");
    header = $("#menu_header");
	menu = $("#menu");
	table = $("#table");

    // Sliders Steps
    vol = $("#slider-1");
    qua = $("#slider-2");
	str = $("#slider-3");
	cos = $("#slider-4");
    
    // Slider Values
    volval = $("#slider_one_value");
    quaval = $("#slider_two_value");
	strval = $("#slider_three_value");
	cosval = $("#slider_four_value");

    // Sliders Steps
    volstep = parseFloat($(vol).attr("step"));
    quastep = parseFloat($(qua).attr("step"));
	strstep = parseFloat($(str).attr("step"));
	cosstep = parseFloat($(cos).attr("step"));
    
    // Sliders
    // vol
    $(vol).on("change",function(){
        if(unit=="l"){
            $(volval).text((parseFloat($(vol).val()).toFixed(1)).toString()+unit);
        }else{
            $(volval).text((parseInt($(vol).val())).toString()+unit); 
        }
    });
    $(volval).text($(vol).val().toString()+unit);
    $("#vol_inc").on("touchstart",function(){
        $(vol).val(parseFloat($(vol).val())+volstep).change();
    });    
    $("#vol_dec").on("touchstart",function(){
        $(vol).val(parseFloat($(vol).val())-volstep).change();
    });
    
    // quantity
    $(qua).on("change",function(){$(quaval).text("x"+$(this).val().toString());});
	$(quaval).text("x"+$(qua).val().toString());
    $("#qua_inc").on("touchstart",function(){
        $(qua).val(parseInt($(qua).val())+quastep).change();
    });    
    $("#qua_dec").on("touchstart",function(){
        $(qua).val(parseInt($(qua).val())-quastep).change();
    });
    
    //strength
    $(str).on("change",function(){$(strval).text(format_strength($(this).val()));});
	$(strval).text(format_strength($(str).val().toString()));
    $("#str_inc").on("touchstart",function(){
        $(str).val(parseFloat(parseFloat($(str).val())+strstep).toFixed(1)).change();
    });    
    $("#str_dec").on("touchstart",function(){
        $(str).val(parseFloat(parseFloat($(str).val())-strstep).toFixed(1)).change();
    });
    
    // cost
    $(cos).on("change",function(){$(cosval).text(format_cost($(this).val()));});
    $(cosval).text(format_cost($(cos).val()));
    $("#cos_inc").on("touchstart",function(){
        $(cos).val(parseFloat(parseFloat($(cos).val())+cosstep).toFixed(1)).change();
    });    
    $("#cos_dec").on("touchstart",function(){
        $(cos).val(parseFloat(parseFloat($(cos).val())-cosstep).toFixed(1)).change();
    });
    
    // Menu
    $("#menu_header img").on("touchstart",toggleDrinks);
    placeholder = $("#placeholder");
    cost_buffer = $("#cost_buffer");
    $(cost_buffer).css("width","100%");
    
    // Add
    $("#add").on("touchstart",add);
    
    // Draw
    _draw();
    
    // Width
    if ($(window).width() > width_step){
        $("#units_big").tmpl().appendTo($("#units"));
    }else{
        $("#units_small").tmpl().appendTo($("#units"));
    }

    // Units
    $("#units").buttonset();
    $("#units > label").on("touchstart",function(){$(this).click();});
    $("#units > label").on("click",function(){
        var new_unit = $("#"+$(this).first().attr("for")).attr("value");
        if(new_unit != unit){
            unit = new_unit;
            $(vol).attr("max",units[unit].max.toString());
            $(vol).attr("min",units[unit].min.toString());
            $(vol).attr("step",units[unit].step.toString());
            volstep = parseFloat(units[unit].step);
            $(vol).val(units[unit].max/2);
            $(vol).change();
        }
    });
    $("#radio1").click();
    
    // debug
    /*
    $("#add").on("click",add);
    $("#menu_header").on("click",toggleDrinks);
    $("#add").click().click().click().click();
    $("#add").click().click().click().click();
    */
    
    // Ignore click
    $(menu).on("click",function(e){e.preventDefault();});
    $(vol).on("click",function(e){e.preventDefault();});
    $(str).on("click",function(e){e.preventDefault();});
    $(cos).on("click",function(e){e.preventDefault();});
    $(qua).on("click",function(e){e.preventDefault();});
}

function add(){
    if(drinks.length < 50){
        // Vibrate
        navigator.notification.vibrate(50);
        
        // New drink
        var drink = new Drink();
        drink.unit = unit;
        drink.strength = parseFloat($(str).val()).toFixed(1);
        drink.volume = parseFloat($(vol).val()).toFixed(1);
        drink.cost = parseFloat(parseFloat($(cos).val()).toFixed(1).toString() + "0").toFixed(2);
        drink.quantity = parseInt($(qua).val());

        // Calc
        calculations = _calculate_booze_index(drink);
        drink.index = calculations["booze_index"];
        drink.alcohol_in_mils = calculations["alcohol_in_mils"];
        if( max_alcohol_mils < drink.alcohol_in_mils ){
            max_alcohol_mils = drink.alcohol_in_mils;
        }

        // Add to array and sort
        drinks.push(drink);
        drinks.sort(function(a,b){return b.index-a.index});
        _draw();
    }
}

function delete_drink(){
    var index = parseInt($(this).attr("index")) - 1;
    var temp = [];
    max_alcohol_mils = 0;
    for(var i = 0;i < drinks.length;i++){
        if( index != i.toString() ){
            temp.push(drinks[i]);
            if( max_alcohol_mils < drinks[i].alcohol_in_mils ){
                max_alcohol_mils = drink.alcohol_in_mils;
            }
        }
    }
    drinks = temp;
    _draw();
}

function _draw(){
    $(table).empty();
    if( drinks.length > 0 ){
        var drink,tmpl;
        count = 1;
        for( index in drinks ){
            drink = drinks[index];
            $("#drink_tmpl").tmpl({
                "drink":drink,
                "zebra":count%2==0,
                "best" :count==1,
                "count":count,
                "alc":drink.alcohol_in_mils/max_alcohol_mils
            }).appendTo(table);
            count++;        
        }
        $("#table .delete").on("touchstart",delete_drink);
    }else{
        $("#drink_placeholder_tmpl").tmpl().appendTo(table);
    }
}

function _calculate_booze_index(drink){
    var mils = _calclate_total_volume_in_ml(drink.unit,drink.volume,drink.quantity);
    var alc = (mils/100)*drink.strength;
    return {"booze_index" : alc/drink.cost, "alcohol_in_mils" : mils };
}

function _calclate_total_volume_in_ml(unit,volume,quantity){
    switch(unit){
        case "l":
          return volume*1000*quantity;
        case "cl":
          return volume*10*quantity;
        case "oz":
          return volume*28.4*quantity;
        default:
            return volume*quantity;
    }
}

function capitalise(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function format_strength(value){
    return parseFloat(value).toFixed(1).toString()+"%";
}

function format_cost(value){
    return parseFloat(value).toFixed(2).toString();
}

function toggleDrinks(){
    // Toggle menu
    if(drinks_toggled){
		$(header).css("bottom","0px");
    }else{
		$(header).css("bottom","330px");
	}
    $(menu).toggle(!drinks_toggled);
    $(imgdown).toggle(!drinks_toggled);
    $(imgup).show(drinks_toggled);
    
    // Update global
	drinks_toggled = !drinks_toggled;
    if( drinks_toggled){
        setTimeout(function(){$(cost_buffer).css("width","18px");},300);
    }else{
        $(cost_buffer).css("width","100%");
    }
}