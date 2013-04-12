$(document).ready(function(){

    var searchUtility = {
        searchTxt : function(formModule) {
            return $(formModule).find(".main-search-input").val()
        },
        clearSearch : function(formModule) {
            $(formModule).find('.spinner').show();
            $(formModule).find('.result').hide();
            $(formModule).removeClass("no-results");
            $(formModule).find('.mood').removeClass("active");
            $(formModule).find('.error-no-results').remove();
            $(formModule).find('.result .tense').remove();
        },
        verbSearch : function(formModule) {
            $.ajax({//AJAX submission
                url: '../query.php',
                type: 'POST',
                data: $(formModule).find('form').serialize(),
                dataType: 'json',
                success: function(data) {

                    $.each(data, function(i, el){
                        $(formModule).find('.result .highlight').html(el.infinitive);
                        $(formModule).find('.result .definition').html(el.infinitiveEnglish);

                        var chunk = '<section class="tense"><header><h4>' + el.tenseEnglish + '</h4></header><p class="example-english">' + el.verbEnglish + '</p><ul><li><span class="subject">yo</span><span class="verb">' + el.form1s + '</span></li><li><span class="subject">t&uacute;</span><span class="verb">' + el.form2s + '</span></li><li><span class="subject">usted</span><span class="verb">' + el.form3s + '</span></li><li><span class="subject">&eacute;l/ella</span><span class="verb">' + el.form3s + '</span></li><li><span class="subject">nosotros</span><span class="verb">' + el.form1p + '</span></li><li><span class="subject">vosotros</span><span class="verb">' + el.form2p + '</span></li><li><span class="subject">ustedes</span><span class="verb">' + el.form3p + '</span></li><li><span class="subject">ellos/ellas</span><span class="verb">' + el.form3p + '</span></li></ul></section>';
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


    $('#frm-lookup').on('submit', function(){
        var formModule = $(this).parent(".common-module");

        //var start = (new Date).getTime();  // log start timestamp

        if ($(formModule).find('.result .highlight').text().toLowerCase() !== searchUtility.searchTxt(formModule).toLowerCase()) {
            searchUtility.clearSearch(formModule);
            searchUtility.verbSearch(formModule);
        }

        //var diff = (new Date).getTime() - start;
        //$("#time").html(diff);

        return false;
    });

    $('#frm-random').on('submit', function(){
        var formModule = $(this).parent(".common-module");
        searchUtility.clearSearch(formModule);
        searchUtility.verbSearch(formModule);

        return false;
    });


    $(".chbx-mood").on("click", function() {

        var formModule = $(this).parents(".common-module");

        if (($(formModule).find('.result .highlight').text().toLowerCase() === searchUtility.searchTxt(formModule).toLowerCase()) && (searchUtility.searchTxt(formModule).toLowerCase() !== "") ) {

            searchUtility.clearSearch(formModule);
            searchUtility.verbSearch(formModule);
        }

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



});
