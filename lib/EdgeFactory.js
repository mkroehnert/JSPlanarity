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
 * @fileOverview Contains a RequireJS module which is used to create edges.
 * @author <a href="mailto:mkroehnert@users.sourceforge.net">Manfred Kroehnert</a> 
 * @version 0.0
 */

define(['RaphaelCanvas', 'Utilities', 'Options'], function(raphaelCanvas, utilities, options) {
    /**
     * Create an Edge.
     */
    function createEdgeBetween(vertex1, vertex2) {
        /**
         * Endpoint one of the edge.
         */
        var startVertex = vertex1;
        /**
         * Endpoint two of the edge.
         */
        var endVertex = vertex2;

        /**
         * Visualisation of the edge.
         */
        var edgeVisualisation = raphaelCanvas.path().attr({
            'stroke-width' : options.getItem("edgeStrokeWidth")
        });
        // draw the edge initially upon creation
        updateVisualisation();

        /**
         * Function to create a string matching the SVG specification:
         * http://www.w3.org/TR/SVG/paths.html#PathData
         */
        function getPathString() {
            var pathString = 'M ' + startVertex.getPositionString() + ' L '
                    + endVertex.getPositionString();
            return pathString;
        }

        /**
         * Update the visualisation of the path to the current position of
         * the vertices
         */
        function updateVisualisation() {
            var pathString = getPathString();
            edgeVisualisation.attr({
                path : pathString
            });
        }

        /**
         * Returns the parameters for the function of the edge (A * x + B *
         * y = C).
         */
        function getEdgeFunction() {
            var A = endVertex.y() - startVertex.y();

            var B = startVertex.x() - endVertex.x();

            var C = A * startVertex.x() + B * startVertex.y();

            return utilities.createLineRepresentation(A, B, C);
        }

        /**
         * This function checks if the given point lies on the edge
         * (excluding the endpoints) and returns true on success, false
         * otherwise.
         */
        function belongsToEdge(point) {
            var threshold = 0.001;
            if (threshold < (point.x - Math.min(startVertex.x(), endVertex.x()))
                    && threshold < (Math.max(startVertex.x(), endVertex.x()) - point.x))
                return true;
            else if (threshold < (point.y - Math.min(startVertex.y(), endVertex.y()))
                    && threshold < (Math.max(startVertex.y(), endVertex.y()) - point.y))
                return true;
            else
                return false;
        }

        /**
         * This function determines if the edge intersects with the edge
         * given as function parameter.
         */
        function intersectWith(secondEdge) {
            var edgeFunction = getEdgeFunction();
            var intersection = edgeFunction.intersect(secondEdge.getEdgeFunction());

            if (!intersection)
                return false;
            return (belongsToEdge(intersection) && secondEdge.belongsToEdge(intersection));
        }

        /**
         * This function changes the visual appearance of the edge and the
         * connected vertices to 'active'.
         */
        function activate() {
            edgeVisualisation.attr({
                stroke : options.getItem("activeEdgeColor")
            });
            startVertex.activate();
            endVertex.activate();
        }

        function markIntersecting() {
            edgeVisualisation.attr({
                stroke : options.getItem("intersectionEdgeColor")
            });
        }

        function deactivate() {
            edgeVisualisation.attr({
                stroke : options.getItem("inactiveEdgeColor")
            });
            startVertex.deactivate();
            endVertex.deactivate();
        }

        /**
         * The Edge object.
         */
        var edge = {
            activate : activate,
            deactivate : deactivate,
            updateVisualisation : updateVisualisation,
            getEdgeFunction : getEdgeFunction,
            intersectWith : intersectWith,
            belongsToEdge : belongsToEdge,
            markIntersecting : markIntersecting
        };

        // add a reference of the edge to both connected vertices.
        startVertex.addEdge(edge);
        endVertex.addEdge(edge);

        return edge;
    }
    
    var edgeFactory = {createEdgeBetween: createEdgeBetween};
    
    return edgeFactory;
});
