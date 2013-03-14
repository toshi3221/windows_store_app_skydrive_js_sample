/// <reference path="/LiveSDKHTML/js/wl.js" />
(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    
    ui.Pages.define("/pages/groupedItems/groupedItems.html", {

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            WL.Event.subscribe("auth.login", onLoginComplete);
            WL.Event.subscribe("auth.logout", onLogoutComplete);
            WL.init();

            WL.login({
                scope: ["wl.signin", "wl.skydrive"],
            });

        },


    });

    function onLoginComplete() {
      var session = WL.getSession();
      if (!session.error) {
        signedInUser();
      }
    };
    function onLogoutComplete() {
        nav.navigate("/pages/groupedItems/groupedItems.html");
    };
    function signedInUser() {
        WL.api({
            path: "/me",
            method: "get"
        }
        ).then(
        function (result) {
            App.username = result.name;
        });;
        var albums_path = "/me/albums";
        WL.api({ path: albums_path, method: "GET" }).then(function (response) {
            var items = response.data;
            var sunday_sky_item = null;
            for (var i = 0; i < items.length; i++) {
                if (items[i].name == "SundaySky") {
                    sunday_sky_item = items[i];
                    break;
                }
            }
            if (sunday_sky_item) {
                var path = sunday_sky_item.id + "/files";

                WL.api({ path: path, method: "GET" }).then(function (response) {
                    var items = response.data;
                    var updated_time_sorted_items = items.sort(function (a, b) {
                        if (a.updated_time < b.updated_time) return 1;
                        if (a.updated_time > b.updated_time) return -1;
                        return 0;
                    });
                    var photo = updated_time_sorted_items[0];
                    var $photo = $("#photo_img");
                    $photo.bind("load", function () {
                        $(this).fadeIn(1500);
                    });
                    $photo.width($(window).width()).attr("src", photo.source);
                });
            }
        });
    };
    function getUserPicture() {
        WL.api
        ({
            path: "me/picture",
            method: "get"
        }).then(function (result) {
            $("#meImg").attr("src", result.location);
            $("#meImg").css("visibility", "visible");
        });
        
      
    };

})();
