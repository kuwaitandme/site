//Smooth Image Loading (SIL) plugin for jQuery.
//Made by Fede in January 2014.

(function ($) {
    var PreloadableImages,
        CurrentImage,
        TotalImages;

    //Preloads an image via AJAX.

    function preloadSingleImage(Element, Options, CurrentTime) {
        var TrueSource = Element.attr(Options.DataAttribute);

        $.ajax({
            type: "GET",
            url: TrueSource,
            cache: true,
        }).done(function () { //always() is used so that it doesn't fail despite an image not existing.
            Element.attr("src", TrueSource); //Show the image.

            //Call the "step" callback, since an image has just been succesfully loaded.

            if (typeof Options.StepCallback === "function") {
                Options.StepCallback((CurrentImage + 1), TotalImages, Element, (new Date()).getTime() - CurrentTime);
            }
        }).always(function () {
            //Recursively call preloadSingleImage() again if not all images have been loaded yet.

            ++CurrentImage;

            if (CurrentImage < TotalImages) {
                var NewTime = (new Date()).getTime();

                setTimeout(function () {
                    preloadSingleImage($(PreloadableImages[CurrentImage]), Options, NewTime);
                }, Options.StepDelay);
            } else {
                //It's done loading at this point, so call the "done" callback.

                if (typeof Options.DoneCallback === "function") {
                    Options.DoneCallback();
                }
            }
        });
    }

    //Starts the image-preloading process.

    $.preloadImages = function (Options) {
        var CustomOptions = $.extend({}, $.preloadImages.DefaultValues, Options);

        PreloadableImages = $(CustomOptions.ElementSelector);
        CurrentImage = 0;
        TotalImages = PreloadableImages.length;

        if (TotalImages > 0) {
            preloadSingleImage($(PreloadableImages[0]), CustomOptions, (new Date()).getTime());
        }
    };

    //The default values.

    $.preloadImages.DefaultValues = {
        ElementSelector: "img[data-src]",
        DataAttribute: "data-src",
        StepDelay: 0,
        StepCallback: undefined, //Current and total images, loaded element, and loading time (that includes the delay) are passed as arguments.
        DoneCallback: undefined
    };
}(jQuery));