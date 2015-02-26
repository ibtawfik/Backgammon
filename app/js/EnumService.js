(function () {
    'use strict';
    /*global angular */

    /**
     * Enums
     */
    angular.module('myApp').factory('enumService', function () {
        var ILLEGAL_CODE,

        ILLEGAL_CODE = {
            ILLEGAL_MOVE: 'ILLEGAL_MOVE',
            ILLEGAL_DELTA: 'ILLEGAL_DELTA',
            INCOMPLETE_MOVE: 'INCOMPLETE_MOVE',
            NO_PLAYER:'NO_PLAYER'
        };

        return {
            ILLEGAL_CODE: ILLEGAL_CODE
        };
    });
}());