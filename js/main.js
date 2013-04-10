$(document).ready(function(){

    var searchUtility = {
        searchTxt : function() {
            return $("#verbsearch").val()
        },
        clearSearch : function() {
            $('#module-lookup .spinner').show();
            $('#module-lookup .result').hide();
            $('#module-lookup').removeClass("no-results");
            $('.mood').removeClass("active");
            $('.error-no-results').remove();
            $('#module-lookup .result .tense').remove();
        },
        verbSearch : function() {
            $.ajax({//AJAX submission
                url: '../query.php',
                type: 'POST',
                data: $('#frm-lookup').serialize(),
                dataType: 'json',
                success: function(data) {

                    $.each(data, function(i, el){
                        $('#module-lookup .result .highlight').html(el.infinitive);
                        $('#module-lookup .result .definition').html(el.infinitiveEnglish);

                        var chunk = '<section class="tense"><header><h4>' + el.tenseEnglish + '</h4></header><p class="example-english">' + el.verbEnglish + '</p><ul><li><span class="subject">yo</span><span class="verb">' + el.form1s + '</span></li><li><span class="subject">t&uacute;</span><span class="verb">' + el.form2s + '</span></li><li><span class="subject">usted</span><span class="verb">' + el.form3s + '</span></li><li><span class="subject">&eacute;l/ella</span><span class="verb">' + el.form3s + '</span></li><li><span class="subject">nosotros</span><span class="verb">' + el.form1p + '</span></li><li><span class="subject">vosotros</span><span class="verb">' + el.form2p + '</span></li><li><span class="subject">ustedes</span><span class="verb">' + el.form3p + '</span></li><li><span class="subject">ellos/ellas</span><span class="verb">' + el.form3p + '</span></li></ul></section>';
                        if (el.moodEnglish.toLowerCase() === "indicative") {
                            $('.mood-indicative').append(chunk);
                        } else if (el.moodEnglish.toLowerCase() === "subjunctive") {
                            $('.mood-subjunctive').append(chunk);
                        } else if (el.moodEnglish.toLowerCase() === "imperative affirmative") {
                            $('.mood-imperative').append(chunk);
                        } else if (el.moodEnglish.toLowerCase() === "imperative negative") {
                            $('.mood-imperative').append(chunk);
                        }
                    });

                    $('.mood').has('.tense').addClass("active");
                    $('#module-lookup .result').fadeIn(300);

                },
                error: function() {
                    //$('#module-lookup .result').empty();
                    $('#module-lookup').addClass("no-results");
                    $('#module-lookup .result').prepend('<p class="error-no-results error">No results found</p>');
                    $('#module-lookup .result').fadeIn(300);
                },
                complete: function() {
                    $('#module-lookup .spinner').hide();
                }
            });

        }
    };


    $('#frm-lookup').on('submit', function(){
        var start = (new Date).getTime();  // log start timestamp

        if ($('#module-lookup .result .highlight').text().toLowerCase() !== searchUtility.searchTxt().toLowerCase()) {
            searchUtility.clearSearch();
            searchUtility.verbSearch();
        }

        var diff = (new Date).getTime() - start;
        $("#time").html(diff);

        return false;
    });


    $(".chbx-mood").on("click", function() {

        if (($('#module-lookup .result .highlight').text().toLowerCase() === searchUtility.searchTxt().toLowerCase()) && (searchUtility.searchTxt().toLowerCase() !== "") ) {
            searchUtility.clearSearch();
            searchUtility.verbSearch();
        }

    });

    $(".link-customize-search").on("click", function() {
        var module = $("#module-customize-search");
        if ($(module).is(":visible")) {
            $(module).slideUp(500);
        } else {
            $(module).slideDown(500);
        }
        return false;
    });



});
