function displayCardsGrade(grade_param) {
    //Lesson navigation script functionality
    //Hides all the cards and then show only those whose "grade" is equal to the active grade.
    //Returns the displayed cards
    let cards = $(".app_column").hide().filter(function () {
        return  ($(this).find(".card-info.app_grade").text().search(grade_param) > -1);
    }).fadeIn();
    return cards;
}

function displayCardsLesson(grade_param, lesson_param) {
    //Hides all the cards and then show only those whose "grade" is equal to the active grade AND whose "lesson" is equal to the active lesson.
    //Returns the displayed cards
    let cards = $(".app_column").hide().filter(function () {
        let grade_flag = ($(this).find(".card-info.app_grade").text().search(grade_param) > -1) ;
        let lesson_flag = ($(this).find(".card-info.app_lesson").text().search(lesson_param) > -1) ;
        return (grade_flag && lesson_flag);
    }).show();
    return cards;
}

function displayCardsSearch(grade_param, lesson_param, search_param) {
    //Hides all the cards and then show only those whose "grade" is equal to the active grade AND whose "lesson" is equal to the active lesson AND whose title contains a string as a substring.
    //Returns the displayed cards
    let cards = $(".app_column").hide().filter(function () {
        let grade_flag = ($(this).find(".card-info.app_grade").text().search(grade_param) > -1) ;
        //Note: The "empty string" is contained in all strings => If we don't have an active lesson, we don't exclude any lessons
        let lesson_flag = ($(this).find(".card-info.app_lesson").text().search(lesson_param) > -1) ;
        //.toLowerCase() => the search is not case-sensitive => .trim() to remove whitespace => .normalize('NFD').replace(/[\u0300-\u036f]/g, "") to remove greek accent marks.
        //Check the end of this file for more info.
        let  substringExist = ( $(this).find(".card-title").text().toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(search_param) > -1 );
        return (grade_flag && lesson_flag && substringExist);
    }).show();
    return cards;
}

function displayCards(grade_parameter,lesson_parameter,search_parameter){
    //Function overloading for displayCards function
    let cardsDisplayed;
    if (arguments.length === 1) cardsDisplayed = displayCardsGrade(grade_parameter)
    else if (arguments.length === 2)  cardsDisplayed = displayCardsLesson(grade_parameter, lesson_parameter)
    else if (arguments.length === 3)  cardsDisplayed = displayCardsSearch(grade_parameter, lesson_parameter, search_parameter)
    else    console.log("Error: displayCards was called with wrong number of parameters")

    cardsWarningMessage(cardsDisplayed.length);  //If there are no such cards, show a warning message
    return cardsDisplayed;
}

function cardsWarningMessage(number_of_cards){
    //Parameter: .length of cards returned from displayCardsGrade/displayCardsLesson/displayCardsSearch
    //Show or hide "no apps found" message
    if (number_of_cards !== 0) $(".apps_alert").hide()
    else $(".apps_alert").fadeIn()
}

function lessonNavigation(){
    $(".categories-list button").click(function (){
        //If you clicked a lesson that is already selected, then nothing happens, otherwise:
        if ( !$(this).hasClass("active") ) {
            //If the lesson you clicked is not 'active", then switch the "active" status to the clicked item
            $(".categories-list button.active").removeClass("active")
            $(this).addClass("active")

            //Reset search filtering
            searchReset();

            //Change breadcrumb .app_gallery_title
            let active_grade_name = $(".grade-selection-ul.grade-selection-ul > li > a.active").text();
            let active_lesson_name = $(this).text();
            $(".app_gallery_title > .lesson_name").html('<i class="bi bi-chevron-right"></i> ' + active_lesson_name );

            //Show all this grade's && lesson's apps (and only those) with .filter()
            displayCards(active_grade_name,active_lesson_name)
        }
    });
}

function makeLessonsNavigation(cards) {
    let lesson_names = []   //Lesson names of this grade are stored here
    $(".categories-list").empty(); //Delete all the existing <button> items from lesson navigation

    //For each card, if the lesson of this card is not included in the array, then insert it.
    cards.find(".card-info.app_lesson").each(function () {
            let name = $(this).text();
            if(!lesson_names.includes(name)) lesson_names.push(name);
        }
    );
    lesson_names.sort(); //Sort the items list

    //For every lesson, append a button to the list
    $.each(lesson_names, function (index, value) {
        $(".categories-list").append("<button type=\"button\" class=\"list-group-item list-group-item-action\">" + value + "</button>");
    });

    if(lesson_names.length === 0) $(".categories-list").append("<span style=\"text-align: center;\">-</span>");
    lessonNavigation(); //bind lesson-buttons
}

function searchReset(){
    //This function resets search input value. It is used when you click a different navigation link
    $(".apps_search").val("");
}

$( document ).ready(function() {
    //Logo click -> Show welcome message
    //For navigation click -> show apps, check out "Grade Navigation Click"
    $(".app_header").click(function (){
        //Reset search input value - Make all grades inactive - Show homepage messages
        searchReset();
        $(".main_content").hide()
        $(".grade-selection-ul.grade-selection-ul > li > a.active").removeClass("active");
        $(".messages_content").show()
    });

    //When the top is not visible in the screen, fadeIn the back-to-top button
    $(window).scroll(function() {
        if ($(this).scrollTop()) {
            $('.top-button').fadeIn();
        }
        else {
            $('.top-button').fadeOut();
        }
    });

    //Scroll back-to-top animation
    $(".top-button").click(function() {
        $("html, body").animate({scrollTop: 0}, 1000);
    });

    //Card shadow effect and card thumbnail effect
    // .shadow and .shadow-sm are classes from the Bootstrap framework
    //for card zoom effect and for image:hover effect only css is required, check client.css
    $(".card").hover(function() {
            $(this).removeClass('shadow-sm');
            $(this).addClass('shadow');
        }, function() {
            $(this).addClass('shadow-sm');
            $(this).removeClass('shadow');
    });

    //Grade navigation script
    $(".grade-selection-ul.grade-selection-ul > li > a").click(function (){
        let active_grade_name = $(this).text();
        let lesson_column = $(".categories_column > *")

        //Reset search filtering
        searchReset();

        if ( !$(this).hasClass("active") ) {
            //If the "lessons" column is still has a sliding effect from a previous navigation change, finish the effect.
            lesson_column.finish();

            //If the grade you clicked is not 'active", then switch the "active" status to the clicked item
            $(".grade-selection-ul.grade-selection-ul > li > a.active").removeClass("active");
            $(this).addClass("active");

            //Change breadcrumb .app_gallery_title. If it is already active then there is no need to change this.
            $(".app_gallery_title > .grade_name").text(active_grade_name);
            lesson_column.slideUp();   //hide categories list
        }

        let c = displayCards(active_grade_name); //display the cards whose grade is equal to "active_grade_name"
        makeLessonsNavigation(c)  //create a new categories list from the cards returned from displayCards.
        lesson_column.slideDown();

        //Reset breadcrumb for lessons and reset list
        $(".lesson_name").text("");
        $(".categories-list button.active").removeClass("active");

        //Navigation click -> Show apps and hide welcome messages
        $(".messages_content").hide()
        $(".main_content").fadeIn()
    });

    //Search apps functionality
    $(".apps_search").on("keyup", function() {
        //.toLowerCase() => the search is not case-sensitive => .trim() to remove whitespace => .normalize('NFD').replace(/[\u0300-\u036f]/g, "") to remove greek accent marks. Check the end of this file for more info.
        let active_grade_name = $(".grade-selection-ul.grade-selection-ul > li > a.active").text();
        let active_lesson_name = $(".categories-list button.active").text();
        let search_value = $(this).val().toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        displayCards(active_grade_name,active_lesson_name,search_value);
    });

});

//Search function uses .normalize() and regular expressions to remove accent marks from greek text.
//https://stackoverflow.com/questions/23346506/javascript-normalize-accented-greek-characters/45797754#45797754
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
