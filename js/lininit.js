// Initializing Fullpage.js
$(document).ready(function () {
    $('#fullpage').fullpage({
        //Navigation
        menu: '#menu',
        lockAnchors: false,
        anchors: ['Instruction', 'Training', 'Statistics', 'Videos', 'Feedback'],
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['Instruction', 'Training', 'Statistics', 'Videos', 'Send Feedback'],
        showActiveTooltip: false,
        slidesNavigation: false,
        slidesNavPosition: 'bottom',

        //Scrolling
        css3: true,
        scrollingSpeed: 500,
        autoScrolling: false,
        fitToSection: false,
        fitToSectionDelay: 15000,
        scrollBar: false,
        easing: 'easeInOutCubic',
        easingcss3: 'ease',
        loopBottom: false,
        loopTop: false,
        loopHorizontal: false,
        continuousVertical: false,
        continuousHorizontal: false,
        scrollHorizontally: false,
        interlockedSlides: false,
        dragAndMove: false,
        offsetSections: false,
        resetSliders: false,
        fadingEffect: false,
        normalScrollElements: '#element1, .element2',
        scrollOverflow: false,
        scrollOverflowReset: false,
        scrollOverflowOptions: null,
        touchSensitivity: 15,
        bigSectionsDestination: null,

        //Accessibility
        keyboardScrolling: true,
        animateAnchor: true,
        recordHistory: true,

        //Design
        controlArrows: true,
        verticalCentered: false,
        sectionsColor: [],
        paddingTop: '10px',
        paddingBottom: '10px',
        fixedElements: '.header, .footer',
        responsiveWidth: 0,
        responsiveHeight: 0,
        responsiveSlides: false,
        parallax: false,
        parallaxOptions: {
            type: 'reveal',
            percentage: 62,
            property: 'translate'
        },
        cards: false,
        cardsOptions: {
            perspective: 100,
            fadeContent: true,
            fadeBackground: true
        },

        //Custom selectors
        sectionSelector: '.section',
        slideSelector: '.slide',

        lazyLoading: true,

        //events
        onLeave: function (origin, destination, direction) {},
        afterLoad: function (origin, destination, direction) {},
        afterRender: function () {},
        afterResize: function (width, height) {},
        afterReBuild: function () {},
        afterResponsive: function (isResponsive) {},
        afterSlideLoad: function (section, origin, destination, direction) {},
        onSlideLeave: function (section, origin, destination, direction) {}
    });

    //methods
    $.fn.fullpage.setAllowScrolling(true);
});

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBvDwnFtfHuNYb3PMQNfLEh6-WKf4PFqkY",
    authDomain: "mental-arithmatic.firebaseapp.com",
    databaseURL: "https://mental-arithmatic.firebaseio.com",
    projectId: "mental-arithmatic",
    storageBucket: "mental-arithmatic.appspot.com",
    messagingSenderId: "1058394091077",
    appId: "1:1058394091077:web:590b3a9841776c761f3d2c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);