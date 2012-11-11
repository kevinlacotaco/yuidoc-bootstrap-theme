$(function() {

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
            updater : function(item) {
                 $('#sidebar .tab-pane a:contains(' + item + ')')[0].click();
                 return item;
            }
        });
        navbarSearch.data('typeahead').source = navbarSource;
    }

    function bindEventsForPage() {
        $('#main-nav li').on('click', function(event) {
            console.log('Store the tab in local storage');
            localStorage['main-nav'] = $(this).find('a').attr('href'); 
            event.preventDefault();
        });
        $('#main-nav li').on('shown', function(event) {
            setUpWidgets();
            event.preventDefault();
        });
    }

    setUpActiveTab();
    bindEventsForPage();
    setUpWidgets();
});
