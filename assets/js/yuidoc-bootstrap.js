$(function() {

    // ************************************************************************* //
    //  HTML templates
    // ************************************************************************* //

    // (None)


    // ************************************************************************* //
    //  Functions
    // ************************************************************************* //

    function setUpActiveTab() {
        if(localStorage['main-nav'] !== null){
            $('a[href="'+ localStorage['main-nav'] + '"]').tab('show');
        }
    }

    function setUpWidgets() {
        var sideSource = [], navbarSource = [], sidebarSearch, navbarSearch;

        $('#sidebar .tab-pane.active li a').each(function(index, elem) {
             sideSource.push($(elem).text());
        });
        $('#sidebar .tab-pane li a').each(function(index, elem) {
             navbarSource.push($(elem).text());
        });

        sidebarSearch = $('#sidebar input[type="search"]');
        sidebarSearch.typeahead({
            updater : function(item) {
                 $('#sidebar .tab-pane.active a:contains(' + item + ')')[0].click();
                 return item;
            }
        });
        sidebarSearch.data('typeahead').source = sideSource;

        navbarSearch = $('.navbar input');

        navbarSearch.typeahead({
            source : navbarSearch.data('obj'),
            matcher : function(item) {
                var regex = new RegExp(this.query, 'ig');

                return regex.test(item.split('/')[1]);
            },
            updater : function(item) {
                window.location.assign(location.protocol + "//" + location.host + '/' + item + '.html');
            }
        });
    }

    function bindEventsForPage() {
        $('#main-nav li').on('click', function(event) {
            localStorage['main-nav'] = $(this).find('a').attr('href'); 
            event.preventDefault();
        });
        $('#main-nav li').on('shown', function(event) {
            setUpWidgets();
            event.preventDefault();
        });

        $('#api-show-protected').on('change', function() {
            if($(this).is(':checked')) {
                $('.protected').toggle($(this).is(true));
                $('.inherited').toggle($('#api-show-inherited').is(':checked'));
                $('.deprecated').toggle($('#api-show-deprecated').is(':checked'));
            } else {
                $('.protected').toggle(false);
            }
        });

        $('#api-show-private').on('change', function() {
            if($(this).is(':checked')) {
                $('.private').toggle(true);
                $('.inherited').toggle($('#api-show-inherited').is(':checked'));
                $('.deprecated').toggle($('#api-show-deprecated').is(':checked'));
            } else {
                $('.private').toggle(false);
            }
        });

        $('#api-show-deprecated').on('change', function() {
            if($(this).is(':checked')) {
                $('.deprecated').toggle(true);
                $('.inherited').toggle($('#api-show-inherited').is(':checked'));
            } else {
                $('.deprecated').toggle(false);
            }
        });

        $('#api-show-inherited').on('change', function() {
            if($(this).is(':checked')) {
                $('.inherited').toggle(true);
                $('.deprecated').toggle($('#api-show-deprecated').is(':checked'));
                $('.private').toggle($('#api-show-private').is(':checked'));
                $('.protected').toggle($('#api-show-protected').is(':checked'));
            } else {
                $('.inherited').toggle(false);
            }
        });

        $('[data-tabid]').on('click', function(event) {
            var tabToActivate = $(this).attr('data-tabid'),
                anchor = $(this).attr('data-anchor');
            event.preventDefault();
            $('[data-toggle=tab][href="'+ tabToActivate + '"]').click();
            $(document).scrollTop( $(anchor).offset().top );
        });
    }


    // ************************************************************************* //
    //  Initializations + Event listeners
    // ************************************************************************* //

    $(window).keyup(function(e) {
        // Listen for 's' key and focus search input if pressed
        if (e.keyCode === 83) { // 's'
            $('#api-tabview-filter input').focus();
        }
    });

    $('#sidebar').keydown(function(e) {
        // Cache variables
        var $this = $(this);

        // Determine if the control/command key was pressed
        if (e.ctrlKey) {
            if (e.keyCode === 37) { // left arrow
                $('#main-nav li a:first').tab('show');
            } else if (e.keyCode === 39) { // right arrow
                $('#main-nav li a:last').tab('show');
            }
        } else {
            if (e.keyCode === 40) { // down arrow
                if ($('#api-tabview-filter input').is(':focus')) {
                    // Scenario 1: We're focused on the search input; move down to the first li
                    $this.find('.tab-content .tab-pane.active li:first a').focus();
                } else if ($this.find('.tab-content .tab-pane.active li:last a').is(':focus')) {
                    // Scenario 2: We're focused on the last li; move up to search input
                    $('#api-tabview-filter input').focus();
                } else {
                    // Scenario 3: We're in the list but not on the last element, simply move down
                    nextIndex = $this
                                    .find('.tab-content .tab-pane.active li')
                                    .find('a:focus')
                                    .parent('li').index() + 1;
                    $this.find('.tab-content .tab-pane.active li:eq('+nextIndex+') a').focus();
                }
                e.preventDefault();
            } else if (e.keyCode === 38) { // up arrow
                if ($('#api-tabview-filter input').is(':focus')) {
                    // Scenario 1: We're focused on the search input; move down to the last li
                    $this.find('.tab-content .tab-pane.active li:last a').focus();
                } else if ($this.find('.tab-content .tab-pane.active li:first a').is(':focus')) {
                    // Scenario 2: We're focused on the first li; move up to search input
                    $('#api-tabview-filter input').focus();
                } else {
                    // Scenario 3: We're in the list but not on the first element, simply move up
                    nextIndex = $this
                                    .find('.tab-content .tab-pane.active li')
                                    .find('a:focus')
                                    .parent('li').index() - 1;
                    $this.find('.tab-content .tab-pane.active li:eq('+nextIndex+') a').focus();
                }
                e.preventDefault();
            }
        }
    })


    // ************************************************************************* //
    //  Immediate function calls
    // ************************************************************************* //

    setUpActiveTab();
    bindEventsForPage();
    setUpWidgets();

});
