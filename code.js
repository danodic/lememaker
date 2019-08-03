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
                x - this.origin_x + this.origin_bg_pos_x + 'px';
            tg.style.backgroundPositionY =
                y - this.origin_y + this.origin_bg_pos_y + 'px';
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
            this.origin_bg_pos_x = parseInt(styles.getPropertyValue('background-position-x'));
            this.origin_bg_pos_y = parseInt(styles.getPropertyValue('background-position-y'));
        },

        init: function () {
            var styles = getComputedStyle(this.el);
            this.origin_bg_pos_x = parseInt(styles.getPropertyValue('background-position-x'));
            this.origin_bg_pos_y = parseInt(styles.getPropertyValue('background-position-y'));

            // Attach events
            this.el.addEventListener(
                'mousedown',
                this.onMousedown.bind(this),
                false
            );
            this.el.addEventListener(
                'mouseup',
                this.onMouseup.bind(this),
                false
            );
            this.el.addEventListener(
                'mousemove',
                this.onMousemove.bind(this),
                false
            );
        }
    };

    return function (el) {
        new _AttachDragTo(el);
    };
})();

AttachDragTo(document.getElementById('picture-container'));

var update_quote = function () {
    var quote = $('#quote-text');

    // Update the text
    quote.text($(this).val());

    // Check how many chars we have
    var count = $(this).val().length;
    var $quoteContainer = $('.quote');
    if (count > 150) {
        $quoteContainer.css('font-size', 20);
    } else if (count > 80) {
        $quoteContainer.css('font-size', 30);
    } else {
        $quoteContainer.css('font-size', 40);
    }
};

var update_last_name = function () {
    $('#last-name').text($(this).val());
};

var update_first_name = function () {
    $('#first-name').text($(this).val());
};

$('#bullshit').on('input change', update_quote);
$('#herp').on('input change', update_last_name);
$('#derp').on('input change', update_first_name);
$("#picture-size").on('mousemove change', handlePictureResize);

$('#file-input').on('change', function (e) {
    loadImage(
        e.target.files[0],
        function (img) {
            // https://stackoverflow.com/questions/10754661/javascript-getting-imagedata-without-canvas
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            $('#picture-container').css(
                'background-image',
                'url("' + canvas.toDataURL('image/png') + '")'
            );
        },
        {}
    );
});

$('#print').on('click', function () {
    // https://stackoverflow.com/questions/26584682/print-page-using-html2canvas
    const meme = document.getElementById('meme');
    html2canvas(meme, {
        backgroundColor: '#000000',
        x: 10, // why?!
        y: 175, // also, why?!?!
        windowWidth: 1000,
        windowHeight: 200,
    }).then(function (canvas) {
        var nWindow = window.open('');
        nWindow.document.body.appendChild(canvas);
        nWindow.focus();
        nWindow.print();
        location.reload();
    });
});

function handlePictureResize(event){
    $("#picture-container").css("background-size", event.target.value + "%");
}
