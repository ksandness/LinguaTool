/*jslint browser: true*/
/*global $, jQuery, Modernizr*/

$(document).ready(function() {

    /*PREP*/
    $("#main-nav a").on("click", function() {
        $("#main-nav a").removeClass("selected");
        $(this).addClass("selected");
        var tab = $(this).data("tab").substring(4);
        $(".common-module").hide();
        searchUtility.clearSearch(".common-module");
        $("#module-" + tab).fadeIn(500);
       return false;
    });

    $(".link-customize").on("click", function() {
        var module = $(this).next(".module-customize");
        if ($(module).is(":visible")) {
            $(module).slideUp(500);
        } else {
            $(module).slideDown(500);
        }
        return false;
    });


    /*MEDIA QUERY*/
    function verbToggle() {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active").find("ul").slideUp(300);
        } else {
            $(this).addClass("active").find("ul").slideDown(300);
        }
    }
    function mobileBehavior() {
        $("body").addClass("mobile");
        $(".mood").on("click", ".tense", verbToggle);
    }
    function desktopBehavior() {
        $("body").addClass("desktop");
        $(".mood").off("click", ".tense", verbToggle).find(".tense").removeClass("active").find("ul").removeAttr("style");
    }


    if (Modernizr.mq('(max-width: 800px)')) {
        mobileBehavior();
    }
    if (Modernizr.mq('(min-width: 801px)')) {
        desktopBehavior();
    }
    $(window).resize(function() {
        if (Modernizr.mq('(max-width: 800px)')) {
            if (!$("body").hasClass("mobile")) {
                $("body").removeClass("desktop");
                mobileBehavior();
            }
        }
        if (Modernizr.mq('(min-width: 801px)')) {
            if (!$("body").hasClass("desktop")) {
                $("body").removeClass("mobile");
                desktopBehavior();
            }
        }
    });


    /*SEARCH*/
    var searchUtility = {
        searchTxt : function(formModule) {
            return $(formModule).find(".main-search-input").val();
        },
        clearSearch : function(formModule) {
            $(formModule).find('.result').hide();
            $(formModule).find(".highlight").text("");
            $(formModule).find(".definition").text("");
            $(formModule).removeClass("no-results");
            $(formModule).find('.mood').removeClass("active");
            $(formModule).find('.error-no-results').remove();
            $(formModule).find('.result .tense').remove();
        },
        verbSearch : function(formModule) {
            $(formModule).find('.spinner').show();
            $.ajax({//AJAX submission
                url: '../query.php',
                type: 'POST',
                data: $(formModule).find('form').serialize(),
                dataType: 'json',
                success: function(data) {

                    $.each(data, function(i, el) {
                        $(formModule).find('.result .highlight').html(el.infinitive);
                        $(formModule).find('.result .definition').html(el.infinitiveEnglish);

                        var chunk = '<section class="tense"><header><h4>' + el.tenseEnglish + '<p class="example-english">' + el.verbEnglish + '</p></h4></header><ul><li><span class="subject">yo</span><span class="verb">' + el.form1s + '</span></li><li><span class="subject">t&uacute;</span><span class="verb">' + el.form2s + '</span></li><li><span class="subject">usted</span><span class="verb">' + el.form3s + '</span></li><li><span class="subject">&eacute;l/ella</span><span class="verb">' + el.form3s + '</span></li><li><span class="subject">nosotros</span><span class="verb">' + el.form1p + '</span></li><li><span class="subject">vosotros</span><span class="verb">' + el.form2p + '</span></li><li><span class="subject">ustedes</span><span class="verb">' + el.form3p + '</span></li><li><span class="subject">ellos/ellas</span><span class="verb">' + el.form3p + '</span></li></ul></section>';
                        if (el.moodEnglish.toLowerCase() === "indicative") {
                            $(formModule).find('.mood-indicative').append(chunk);
                        } else if (el.moodEnglish.toLowerCase() === "subjunctive") {
                            $(formModule).find('.mood-subjunctive').append(chunk);
                        } else if (el.moodEnglish.toLowerCase() === "imperative affirmative") {
                            $(formModule).find('.mood-imperative').append(chunk);
                        } else if (el.moodEnglish.toLowerCase() === "imperative negative") {
                            $(formModule).find('.mood-imperative').append(chunk);
                        }
                    });

                    $(formModule).find('.mood').has('.tense').addClass("active");
                    $(formModule).find('.result').fadeIn(300);

                },
                error: function() {
                    //$('#module-lookup .result').empty();
                    $(formModule).addClass("no-results");
                    $(formModule).find('.result').prepend('<p class="error-no-results error">No results found</p>');
                    $(formModule).find('.result').fadeIn(300);
                },
                complete: function() {
                    $(formModule).find('.spinner').hide();
                }
            });

        }
    };


    $('#frm-lookup').on('submit', function() {
        var formModule = $(this).parent(".common-module");

        if ($(formModule).find('.result .highlight').text().toLowerCase() !== searchUtility.searchTxt(formModule).toLowerCase()) {
            searchUtility.clearSearch(formModule);
            searchUtility.verbSearch(formModule);
        }

        return false;
    });

    $('#frm-random').on('submit', function() {
        var formModule = $(this).parent(".common-module");
        searchUtility.clearSearch(formModule);
        searchUtility.verbSearch(formModule);
        return false;
    });


    $(".chbx-mood").on("click", function() {

        var formModule = $(this).parents(".common-module");

        if (($(formModule).find('.result .highlight').text().toLowerCase() === searchUtility.searchTxt(formModule).toLowerCase()) && (searchUtility.searchTxt(formModule).toLowerCase() !== "")) {

            searchUtility.clearSearch(formModule);
            searchUtility.verbSearch(formModule);
        }

    });




});
