/*
 * Copyright 2010 Manfred Kroehnert <mkroehnert@users.sourceforge.net>
 *
 * This software is licensed under the terms of GPLv3+:
 *
 * JSPlanarity is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * JSPlanarity is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JSPlanarity.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @fileOverview Contains a RequireJS module which contains utility methods.
 * @author <a href="mailto:mkroehnert@users.sourceforge.net">Manfred Kroehnert</a> 
 * @version 0.0
 */

define(['Options'], function(options){
    /**
     * This function creates a line representation in the form of the
     * equation A*x + B*y = C from the three parameters A, B and C.
     */
    function createLineRepresentation(A, B, C) {
        function intersect(otherLine) {
            var A2 = otherLine.A;
            var B2 = otherLine.B;
            var C2 = otherLine.C;
            var determinant = A * B2 - B * A2;
            if (0 === determinant) {
                // lines are parallel
                return null;
            } else {
                var x = (B2 * C - B * C2) / determinant;
                var y = (A * C2 - A2 * C) / determinant;
                return {
                    x : x,
                    y : y
                };
            }
        }
    
        return {
            A : A,
            B : B,
            C : C,
            intersect : intersect
        };
    }

    /**
     * This function returns a random number between
     * configuration.randomMinValue and configuration.randomMaxValue.
     */
    function getRandomInt() {
        return Math.floor(Math.random()
            * (options.randomMaxValue - options.randomMinValue + 1))
            + options.randomMinValue;
    }

    return {
        createLineRepresentation : createLineRepresentation,
        getRandomInt : getRandomInt
    };
});
