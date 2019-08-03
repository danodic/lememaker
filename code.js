// http://jsfiddle.net/joplomacedo/VRvUB/236/
var AttachDragTo = (function () {
    var _AttachDragTo = function (el) {
        this.el = el;
        this.mouse_is_down = false;

        this.init();
    };

    _AttachDragTo.prototype = {
        onMousemove: function (e) {
            if (!this.mouse_is_down) return;

            var tg = e.target,
                x = e.clientX,
                y = e.clientY;

            tg.style.backgroundPositionX =
                x - this.origin_x + this.origin_bg_pos_x + "px";
            tg.style.backgroundPositionY =
                y - this.origin_y + this.origin_bg_pos_y + "px";
        },

        onMousedown: function (e) {
            this.mouse_is_down = true;
            this.origin_x = e.clientX;
            this.origin_y = e.clientY;
        },

        onMouseup: function (e) {
            var tg = e.target,
                styles = getComputedStyle(tg);
            this.mouse_is_down = false;
            this.origin_bg_pos_x = parseInt(
                styles.getPropertyValue("background-position-x"),
                10
            );
            this.origin_bg_pos_y = parseInt(
                styles.getPropertyValue("background-position-y"),
                10
            );
        },

        init: function () {
            var styles = getComputedStyle(this.el);
            this.origin_bg_pos_x = parseInt(
                styles.getPropertyValue("background-position-x"),
                10
            );
            this.origin_bg_pos_y = parseInt(
                styles.getPropertyValue("background-position-y"),
                10
            );

            // Attach events
            this.el.addEventListener(
                "mousedown",
                this.onMousedown.bind(this),
                false
            );
            this.el.addEventListener(
                "mouseup",
                this.onMouseup.bind(this),
                false
            );
            this.el.addEventListener(
                "mousemove",
                this.onMousemove.bind(this),
                false
            );
        }
    };

    return function (el) {
        new _AttachDragTo(el);
    };
})();

AttachDragTo(document.getElementById("picture-container"));

var update_quote = function () {
    var quote = $("#quote-text");

    // Update the text
    quote.text($(this).val());

    // Check how many chars we have
    var count = $(this).val().length;
    var quote_container = $(".quote");
    if (count > 150) {
        quote_container.attr("style", "font-size: 20px;");
    } else if (count > 80) {
        quote_container.attr("style", "font-size: 30px;");
    } else {
        quote_container.attr("style", "font-size: 40px;");
    }
};

var update_last_name = function () {
    $("#last-name").text($(this).val());
};

var update_first_name = function () {
    $("#first-name").text($(this).val());
};

$("#bullshit").keypress(update_quote);
$("#bullshit").change(update_quote);
$("#bullshit").keyup(update_quote);
$("#herp").keypress(update_last_name);
$("#herp").change(update_last_name);
$("#herp").keyup(update_last_name);
$("#derp").keypress(update_first_name);
$("#derp").change(update_first_name);
$("#derp").keyup(update_first_name);

document.getElementById("file-input").onchange = function (e) {
    loadImage(
        e.target.files[0],
        function (img) {
            // https://stackoverflow.com/questions/10754661/javascript-getting-imagedata-without-canvas
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            $("#picture-container").css(
                "background-image",
                "url('" + canvas.toDataURL("image/png") + "')"
            );
        },
        {}
    );
};

$("#print").click(function () {
    // https://stackoverflow.com/questions/26584682/print-page-using-html2canvas
    html2canvas(document.getElementById("meme")).then(function (canvas) {
        var nWindow = window.open("");
        nWindow.document.body.appendChild(canvas);
        nWindow.focus();
        nWindow.print();
        location.reload();
    });
});