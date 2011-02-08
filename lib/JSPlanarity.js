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
 * Global JSPlanarity object.
 */
define(['GraphGenerator', 'Options'], function(graphGenerator, options) {
    window.JSPlanarity = (function(graphGenerator, options) {
        /**
         * This function kicks of the application.
         */
        function init() {
            graphGenerator.createNewGraph(options.difficulty);
        }
    
        /**
         * This function checks if the edges of the graph intersect.
         */
        function checkSolution() {
            var intersectionsLeft = graphGenerator.checkEdgeIntersection();
            if (0 < intersectionsLeft)
                alert('There are ' + intersectionsLeft + ' intersections left to clean up.');
            else {
                alert('Congratulations: You WON Stage ' + (options.difficulty - 3));
                options.difficulty++;
                graphGenerator.createNewGraph(options.difficulty);
            }
        }
    
        /**
         * Return an object containing all the public methods of JSPlanarity.
         */
        return {
            init: init,
            checkSolution: checkSolution,
            createNewGraph: graphGenerator.createNewGraph
        };
    }(graphGenerator, options));
});
