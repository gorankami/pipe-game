/*
 * @author Goran Antic
 * the most used utilities for the project
 */


/*
 * binds an function to a scope in which it will be running, useful on events
 */
export function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}