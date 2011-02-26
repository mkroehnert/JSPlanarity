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
define(['icons', 'RaphaelCanvas', 'GraphGenerator', 'Options'], function(icons, raphaelCanvas, graphGenerator, options) {
    window.JSPlanarity = (function(RaphaelCanvas, graphGenerator, options) {
        var levelIndicator = RaphaelCanvas.text(10, 15, 'Level: ' + 0);
        levelIndicator.attr({
            'text-anchor': 'start',
            'font-family': 'cursive',
            'font-size': '20',
            'font-weight': 'bold',
            'fill-opacity': 0.5
        });
        
        var infoButton = RaphaelCanvas.path(icons["i"]).attr({fill: "#333", stroke: "none"});
        infoButton.translate(options.getItem("xSize") - 40, options.getItem("ySize") - 40);

        /**
         * This function kicks of the application.
         */
        function generate() {
            var difficulty = options.getItem("difficulty");
            graphGenerator.createNewGraph(difficulty);
            levelIndicator.attr({'text': ('Level: ' + (difficulty - 3))});
        }
    
        /**
         * This function checks if the edges of the graph intersect.
         */
        function checkSolution() {
            var intersectionsLeft = graphGenerator.checkEdgeIntersection();
            if (0 < intersectionsLeft)
                alert('There are ' + intersectionsLeft + ' intersections left to clean up.');
            else {
                var difficulty = options.getItem("difficulty");
                alert('Congratulations: You WON Level ' + (difficulty - 3));
                options.setItem("difficulty", ++difficulty);
                generate();
            }
        }
        
        /**
         * This function resets the program to the initial state and generates
         * a new graph by calling the generate() function.
         */
         function reset() {
             options.reset();
             generate();
         }
         
         /**
          * This function opens a dialog and asks the user for the difficulty
          * level.
          * If the entered number is smaller than 1 the level gets set to 1.
          */
         function selectLevel() {
            var difficulty = parseInt( window.prompt('Enter Level Number', '1') );
            if (difficulty < 1)
                difficulty = 1;
            options.setItem("difficulty", (difficulty + 3));
            generate();
        }
    
        /**
         * Return an object containing all the public methods of JSPlanarity.
         */
        return {
            generate: generate,
            reset: reset,
            selectLevel: selectLevel,
            checkSolution: checkSolution,
            createNewGraph: graphGenerator.createNewGraph
        };
    }(raphaelCanvas, graphGenerator, options));
    return window.JSPlanarity;
});
