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
 * @fileOverview Contains a RequireJS module which is used to generate graphs.
 * @author <a href="mailto:mkroehnert@users.sourceforge.net">Manfred Kroehnert</a> 
 * @version 0.0
 */

define(['RaphaelCanvas', 'VertexFactory', 'EdgeFactory', 'Utilities'], function(raphaelCanvas, vertexFactory, edgeFactory, utilities) {
    /**
     * Array of all created vertices.
     */
    var vertexArray = [];

    /**
     * Array containing all edges present in the graph.
     */
    var edgeArray = [];

    /**
     * This function resets all variables and creates a new graph.
     */
    function createNewGraph(difficultyLevel) {
        raphaelCanvas.clear();
        delete vertexArray;
        vertexArray = [];
        delete edgeArray;
        edgeArray = [];

        generatePlanarGraph(difficultyLevel);
        utilities.arrangeVerticesInCircle(vertexArray);
    }

    /**
     * This function generates a planar graph as describe in the wiki of
     * planarity.net: http://johntantalo.com/wiki/Planarity. Courtesy to John
     * Tantalo for inventing the algorithm.
     */
    function generatePlanarGraph(numberOfLines) {
        function generateLines() {
            // generate numberOfLines intersecting lines
            var lineRepresentations = [];
            var rand = utilities.getRandomInt;
            for ( var i = 0; i < numberOfLines; i++) {
                lineRepresentations
                        .push(utilities.createLineRepresentation(rand(), rand(), rand()));
            }

            // generate the index/label for each line starting at 1.
            lineRepresentations.map(function(line, index) {
                line.index = index + 1;
            });

            // calculate the intersections
            var intersections = [];
            var linesCopy = lineRepresentations.slice();
            while (1 < linesCopy.length) {
                var currentLine = linesCopy.pop();

                intersections.push.apply(intersections, linesCopy.map(function(line) {
                    return line.intersect(currentLine);
                }));
            }

            if (intersections.some(function(element) {
                return (null === element);
            })) {
                // there are parallel lines
                return null;
            }
            return lineRepresentations;
        }

        /**
         * This function calculates the pairIndex of two lines. It is taken from
         * http://johntantalo.com/wiki/Planarity
         */
        function pairIndex(lineIndex1, lineIndex2, numberOfLines) {
            // lineIndex1 must be smaller than lineIndex2 for pairIndex to
            // be bijective
            if (lineIndex1 >= lineIndex2)
                return pairIndex(lineIndex2, lineIndex1, numberOfLines);

            var index = (lineIndex1 * (2 * numberOfLines - lineIndex1 - 1) / 2) + lineIndex1
                    - lineIndex2;
            return index;
        }

        // generate lines until there are no parallel ones
        var lineRepresentations;
        do {
            lineRepresentations = generateLines();
        } while (null === lineRepresentations);

        // create n*(n-1)/2 vertices
        var vertexCount = numberOfLines * (numberOfLines - 1) / 2;
        for ( var j = 0; j < vertexCount; j++) {
            vertexArray.push(vertexFactory.createVertex());
        }

        // generate edges
        for ( var lineIndex = 0; lineIndex < lineRepresentations.length; lineIndex++) {
            var currentLine = lineRepresentations[lineIndex];
            // create an array of all lines intersecting the one with index
            // lineIndex
            var M = lineRepresentations.filter(function(line, index) {
                return (index != lineIndex);
            });
            // check if there are really numberOfLines - 1 intersections
            // order the M by the intersection points with each line
            M.sort(function(line1, line2) {
                var intersection1 = currentLine.intersect(line1);
                var intersection2 = currentLine.intersect(line2);
                // if intersection2 has a higher x value the
                // difference is negative and line1 gets situated before line2
                return (intersection2.x - intersection1.x);
            });
            // create the edges
            for ( var edgeIndex = 0; edgeIndex < M.length - 1; edgeIndex++) {
                var u = pairIndex(currentLine.index, M[edgeIndex].index, numberOfLines);
                var v = pairIndex(currentLine.index, M[edgeIndex + 1].index, numberOfLines);
                edgeArray.push(edgeFactory.createEdgeBetween(vertexArray[u], vertexArray[v]));
            }
        }
        vertexArray.map(function(vertex) {
            vertex.toFront();
        });
    }

    /**
     * This function checks if the edges of the graph intersect.
     * @return number of intersections left
     */
    function checkEdgeIntersection() {
        // create a copy of the edgeArray since we don't want to destroy the
        // original one
        var edges = edgeArray.slice();
        var intersections = [];
        while (1 < edges.length) {
            var currentEdge = edges.pop();

            intersections.push.apply(intersections, edges.filter(function(edge) {
                return edge.intersectWith(currentEdge);
            }));
        }
        return (0 < intersections.length);
    }

    /**
     * Return an object containing all the public methods of JSPlanarity.
     */
    return {
        checkEdgeIntersection : checkEdgeIntersection,
        createNewGraph : createNewGraph
    };
});