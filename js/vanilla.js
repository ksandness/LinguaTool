/*jslint browser: true*/
/*global $, Modernizr*/

/*Test Comment*/

$(document).ready(function() {

    /*************/
    /*STORE COMMON SELECTED ELEMENTS IN VARIABLES*/
    /*************/
    //var mainNav$ = $("#main-nav").find("a");
    var mainNav$ = document.getElementById("main-nav").querySelectorAll('a');
    console.log(mainNav$);


    /*************/
    /*GENERAL*/
    /*************/

    /**
     * Clears elements of the form specified as the parameter
     */
    function clearFormElements(ele) {
        var inputsAll = ele.querySelectorAll("input");
        for (var i = 0; i < inputsAll.length; i++) {
            switch (inputsAll[i].type) {
                case 'password':
                case 'select-multiple':
                case 'select-one':
                case 'text':
                case 'textarea':
                    inputsAll[i].value='';
                    break;
                case 'checkbox':
                case 'radio':
                    inputsAll[i].checked = false;
                    break;
            }
        }
    }

    /**
     * Performs cleanup of main content area when a main navigation tag is clicked on
     */
    eventUtility.addEvent(document, "click", function(event) {
        var target = eventUtility.getTarget(event);

        if (target.tagName.toUpperCase() === "A" && target.parentNode.parentNode.parentNode.id === "main-nav") {

            var allForms = document.querySelectorAll('form');
            for (var i = 0; i < allForms.length; i++) {
                clearFormElements(allForms[i]);
            }

            var customizeModules = document.getElementsByClassName("module-customize");
            for (var i = 0; i < customizeModules.length; i++) {
                customizeModules[i].style.display="none"
            }

            for (var i = 0; i < mainNav$.length; i++) {
                eventUtility.removeClass(mainNav$[i], "selected");
            }
            eventUtility.addClass(target, "selected");

            var tab = target.getAttribute("data-tab").substring(4);

            var commonModules = document.getElementById("main-content").getElementsByClassName("common-module");
            for (var i = 0; i < commonModules.length; i++) {
                commonModules[i].style.display="none";
                commonModules[i].style.opacity=0;
            }

            searchUtility.clearSearch(".common-module");

            var currentTab = document.getElementById("module-" + tab);

            currentTab.style.display="block";
            var runCount = 1;
            function timerMethod() {
                runCount++;
                if(runCount > 10) clearInterval(timerId);

                var opacity = runCount/10;
                currentTab.style.opacity=opacity;
            }
            var timerId = setInterval(timerMethod, 50);


            eventUtility.preventDefault(event);
        }

        if(target.className == "link-customize") {
            var slideDiv = node_after(target);
            slideDiv.style.display = "block";
            slideDiv.style.overflow = "hidden";
            var height = slideDiv.clientHeight;
            slideDiv.style.height = "0px";
            slideDown(slideDiv, height, 10, 50);
            if(target.nextSibling.style.display="block") {
                console.log("showing");
            } else {
                console.log("hidding");
            }
        }
    });


    /**
     * Toggles visibility of "customize search/visibility" box
     */
    /*$(".link-customize").on("click", function() {
        var module = $(this).next(".module-customize");
        if ($(module).is(":visible")) {
            $(module).slideUp(500);
        } else {
            $(module).slideDown(500);
        }
        return false;
    });*/


    /*************/
    /*BREAKPOINT BEHAVIOR - functions specific to a maximum or minimum screen size*/
    /*************/

    /**
     * function - accordion style behavior applied to verb tenses in mobile view
     */
    function verbToggle() {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active").find("ul").slideUp(300);
        } else {
            $(this).addClass("active").find("ul").slideDown(300);
        }
    }

    /**
     * function that implements the mobile UI
     */
    function mobileBehavior() {
        $("body").addClass("mobile");
        $("#main-content").on("click", ".tense", verbToggle);
    }

    /**
     * function that implements the desktop UI
     */
    function desktopBehavior() {
        $("body").addClass("desktop");
        $("#main-content").off("click", ".tense", verbToggle).find(".tense").removeClass("active").find("ul").removeAttr("style");
    }

    /**
     * ON LOAD
     * establish correct UI view, piggybacking off of Modernizr's Media Query method,
     * this method ensures that the JS breakpoints are synced up with the CSS breakpoints
     */
    if (Modernizr.mq('(max-width: 800px)')) {
        mobileBehavior();
    }
    if (Modernizr.mq('(min-width: 801px)')) {
        desktopBehavior();
    }

    /**
     * ON RESIZE
     * establish correct UI view, piggybacking off of Modernizr's Media Query method,
     * this method ensures that the JS breakpoints are synced up with the CSS breakpoints
     */
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


    /*************/
    /*VERB SEARCH FUNCTIONALITY (Random or Lookup)*/
    /*************/

    /**
     * OBJECT LITERAL
     * searchTxt: returns the search input value
     * clearSearch: preps for new search by clearing previous search and resetting the UI
     * verbSearch: triggers ajax request, JSON returned, results displayed
     */
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
            $(formModule).find('.module-suggestions').hide();
            liPossition = -1;
        },
        verbSearch : function(formModule) {
            $(formModule).find('.spinner').show();
            $.ajax({//AJAX submission
                url: '../query.php',
                type: 'POST',
                data: $(formModule).find('form').serialize(),
                dataType: 'json',
                success: function(data) {

                    var indicativeChunk = '';
                    var subjunctiveChunk = '';
                    var imperativeChunk = '';

                    $.each(data, function(i, el) {
                        if (i === 0) {
                            $(formModule).find('.result .highlight').html(el.infinitive);
                            $(formModule).find('.result .definition').html(el.infinitiveEnglish);
                        }

                        var chunk = '<section class="tense"><header><h4>' + el.tenseEnglish + '<p class="example-english">' + el.verbEnglish + '</p></h4></header><ul><li><span class="subject">yo</span><span class="verb">' + el.form1s + '</span></li><li><span class="subject">t&uacute;</span><span class="verb">' + el.form2s + '</span></li><li><span class="subject">usted</span><span class="verb">' + el.form3s + '</span></li><li><span class="subject">&eacute;l/ella</span><span class="verb">' + el.form3s + '</span></li><li><span class="subject">nosotros</span><span class="verb">' + el.form1p + '</span></li><li><span class="subject">vosotros</span><span class="verb">' + el.form2p + '</span></li><li><span class="subject">ustedes</span><span class="verb">' + el.form3p + '</span></li><li><span class="subject">ellos/ellas</span><span class="verb">' + el.form3p + '</span></li></ul></section>';
                        if (el.moodEnglish.toLowerCase() === "indicative") {
                            indicativeChunk += chunk;
                            //$(formModule).find('.mood-indicative').append(chunk);
                        } else if (el.moodEnglish.toLowerCase() === "subjunctive") {
                            subjunctiveChunk += chunk;
                            //$(formModule).find('.mood-subjunctive').append(chunk);
                        } else if (el.moodEnglish.toLowerCase() === "imperative affirmative") {
                            imperativeChunk += chunk;
                            //$(formModule).find('.mood-imperative').append(chunk);
                        } else if (el.moodEnglish.toLowerCase() === "imperative negative") {
                            imperativeChunk += chunk;
                            //$(formModule).find('.mood-imperative').append(chunk);
                        }
                    });
                    $(formModule).find('.mood-indicative').append(indicativeChunk);
                    $(formModule).find('.mood-subjunctive').append(subjunctiveChunk);
                    $(formModule).find('.mood-imperative').append(imperativeChunk);
                    $(formModule).find('.mood').has('.tense').addClass("active");
                    $(formModule).find('.result').fadeIn(300);

                },
                error: function() {
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


    /**
     * STANDARD VERB SEARCH
     * previous search cleared
     * new search results displayed
     */
    $('#frm-lookup').on('submit', function() {
        var formModule = $(this).parent(".common-module");

        /*if currently displaying a previous search, make sure new search is different*/
        if ($(formModule).find('.result .highlight').text().toLowerCase() !== searchUtility.searchTxt(formModule).toLowerCase()) {
            searchUtility.clearSearch(formModule);
            searchUtility.verbSearch(formModule);
        }

        return false;
    });

    /**
     * RANDOM VERB SEARCH
     * previous search cleared
     * new search results displayed
     */
    $('#frm-random').on('submit', function() {
        var formModule = $(this).parent(".common-module");
        $("input[name=currentrandom]").attr("value", "");
        searchUtility.clearSearch(formModule);
        searchUtility.verbSearch(formModule);
        return false;
    });


    /**
     * CUSTOMIZE SEARCH / FILTER
     * previous search cleared (only if previous search currently displayed)
     * new search results displayed (only if previous search currently displayed)
     */
    $(".chbx-mood").on("click", function() {

        var formModule = $(this).parents(".common-module");

        if ($(formModule).attr("id") === "module-lookup") {
            if (($(formModule).find('.result .highlight').text().toLowerCase() === searchUtility.searchTxt(formModule).toLowerCase()) && (searchUtility.searchTxt(formModule).toLowerCase() !== "")) {

                searchUtility.clearSearch(formModule);
                searchUtility.verbSearch(formModule);
            }
        } else if ($(formModule).attr("id") === "module-random") {
            if ($(formModule).find(".result .highlight").text() !== "") {
                $("input[name=currentrandom]").attr("value", $(formModule).find(".result .highlight").text());
                searchUtility.clearSearch(formModule);
                searchUtility.verbSearch(formModule);
            }
        }
    });


    /*************/
    /*SEARCH SUGGESTION BOX*/
    /*************/

    var liPossition = -1;//Suggestion List focused item. Initiall set to -1(nothing selected)

    /**
     * On suggestion list item hover, set liPossition to list item currently being hovered on
     */
    $("#main-content").on("mouseover", "#lookup-suggestions li", function() {
        $("#lookup-suggestions li").removeClass("selected-suggest");
        $(this).addClass("selected-suggest");
        liPossition = $(this).index();
    });

    /**
     * On suggestion list item click, select verb and trigger search
     */
    $("#main-content").on("click", "#lookup-suggestions li", function() {
        $("#verbsearch").val($(this).text());
        $("#frm-lookup").submit();
    });

    /**
     * On KEYPRESS
     * Down Arrow - select next suggest list item and update input box display
     * Up Arrow - select previous suggest list item and update input box display
     * Any other key - trigger ajax suggestion search if applicable
     */
    $("#verbsearch").on("keyup", function(e) {

        if (e.keyCode === 40) { // down arrow key code
            $("#lookup-suggestions li").removeClass("selected-suggest");
            if (liPossition !== $("#lookup-suggestions li").length - 1) {
                liPossition++;
            }
            $("#verbsearch").val($("#lookup-suggestions li:eq(" + liPossition + ")").text());
            $("#lookup-suggestions li:eq(" + liPossition + ")").addClass("selected-suggest");

        } else if (e.keyCode === 38) { // up arrow key code
            $("#lookup-suggestions li").removeClass("selected-suggest");
            if (liPossition !== 0) {
                liPossition--;
            }
            $("#verbsearch").val($("#lookup-suggestions li:eq(" + liPossition + ")").text());
            $("#lookup-suggestions li:eq(" + liPossition + ")").addClass("selected-suggest");

        } else if (e.keyCode === 13) { // enter key code
            $("#lookup-suggestions").hide();
        } else {
            var partialString = $("#verbsearch").val();
            if (partialString.length >= 2) {
                $.ajax({//AJAX submission
                    url: '../query.php',
                    type: 'POST',
                    data: { 'suggestion_txt' : partialString },
                    dataType: 'json',
                    success: function(data) {
                        var suggestList = '';
                        $.each(data, function(i, el) {
                            var chunk = '<li>' + el.infinitive + '</li>';
                            suggestList += chunk;
                        });
                        $("#lookup-suggestions").html(suggestList).show();
                    },
                    error: function() {
                        $("#lookup-suggestions").hide();
                    }
                });
            }
        }
    });




});
