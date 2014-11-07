/*
 * @author Goran Antic
 * the most used utilities for the project
 */
 

/*
 * binds an function to a scope in which it will be running, useful on events
 */
function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

/*
 * different ajax calls on multiple places made easier
 */
function callAjax(url, data, fsuccess, ferror) {
    if (ferror === undefined) ferror = function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data || {}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: fsuccess,
        error: ferror
    });
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}