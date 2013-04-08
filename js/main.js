$(document).ready(function(){

    $('#frm-lookup').on('submit', function(){
        var start = (new Date).getTime();  // log start timestamp

        var searchText = $("#verbsearch").val();

        if ($('#module-lookup .result .highlight').text().toLowerCase() !== searchText.toLowerCase()) {
            $('#module-lookup .spinner').show();
            $('#module-lookup .result').hide();
        }

        $.ajax({
            /*contentType: "application/x-www-form-urlencoded;charset=utf-8",*/
            url: '../query.php',
            type: 'POST',
            data: $('#frm-lookup').serialize(),
            dataType: 'json',
            success: function(data) {
                $.each(data, function(i, el){
                    if ($('#module-lookup .result .highlight').text().toLowerCase() !== searchText.toLowerCase()) {
                        $('#module-lookup .result .highlight').html(el.infinitive);
                        $('#module-lookup .result .definition').html(el.infinitiveEnglish);
                        $('#module-lookup .result .tense').remove();
                        $.each(data, function(i, el){
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
                        $('#module-lookup .result').fadeIn(300);
                        return false;
                    }
                });

            },
            error: function() {
                $('#module-lookup .result').empty();
                $('#module-lookup .result').prepend('<p>No results found</p>');
                $('#module-lookup .result').fadeIn(300);
            },
            complete: function() {
                $('#module-lookup .spinner').hide();
            }
        });

        var diff = (new Date).getTime() - start;
        $("#time").html(diff);

        return false;
    });


    $(".chbx-mood").on("click", function() {
        console.log("test");
    });



});
