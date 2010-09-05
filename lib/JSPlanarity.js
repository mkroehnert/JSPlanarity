/*
 * Copyright 2010 Manfred Kroehnert <mkroehnert@users.sourceforge.net>
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
var JSPlanarity = (function(Raphael) {
    /**
     * This object holds the configurable values of JSPlanarity.
     */
    var configuration = {
        xSize : '600',
        ySize : '600',
        vertexRadius : 7,
        inactiveVertexColor : '#0F0',
        activeVertexColor : '#F00',
        edgeStrokeWidth : '2',
        inactiveEdgeColor : '#000',
        activeEdgeColor : '#FFF'
    };

    /**
     * The Raphael object which creates the shapes. It is created through the
     * init() function.
     */
    var raphaelPaper = {};

    /**
     * Holds an object with factory functions. It is initialised through a call
     * to createFactories() which is done by the init() function.
     */
    var factories = {};

    /**
     * Array of all created vertices.
     */
    var vertexArray = [];

    /**
     * Array containing all edges present in the graph.
     */
    var edgeArray = [];

    /**
     * This function creates an object which contains all the factory functions
     * needed to create the graphic objects.
     */
    function createFactories(raphaelPaper) {
        /**
         * Create a vertex at position (xpos, ypos). The default position is the
         * origin.
         */
        function createVertex(xpos, ypos) {
            /**
             * Array holding all edge references of the vertex.
             */
            var vertexEdges = [];
            /**
             * Holds the visualisation of the vertex.
             */
            var vertexVisualisation = raphaelPaper.circle(xpos || 0, ypos || 0,
                    configuration.vertexRadius).attr( {
                fill : configuration.inactiveVertexColor
            });

            /**
             * This function moves the vertex visualisation to the front of the
             * canvas.
             */
            function toFront() {
                vertexVisualisation.toFront();
            }

            /**
             * Function to set a e new position for the vertex.
             */
            function setPosition(x, y) {
                // respect the canvas limits
                var newX = Math.max(0, x);
                newX = Math.min(newX, configuration.xSize);
                var newY = Math.max(0, y);
                newY = Math.min(newY, configuration.ySize);

                vertexVisualisation.attr( {
                    cx : newX,
                    cy : newY
                });
                // update the visualisation of all connected edges
                vertexEdges.map(function(item) {
                    item.updateVisualisation();
                });
            }

            /**
             * Function which adds an edge to the current object.
             */
            function addEdge(newEdge) {
                vertexEdges.push(newEdge);
            }

            /**
             * Function to return the position of the vertex as a string.
             */
            function getPositionString() {
                return '' + vertexVisualisation.attr('cx') + ' ' + vertexVisualisation.attr('cy');
            }

            /**
             * Function which returns the x Position of the vertex.
             */
            function x() {
                return vertexVisualisation.attr('cx');
            }

            /**
             * Function which returns the y Position of the vertex.
             */
            function y() {
                return vertexVisualisation.attr('cy');
            }

            /**
             * Callback which is used for the ondrag Event of Raphael.
             */
            function startDrag() {
                // storing original coordinates
                vertexVisualisation.ox = vertexVisualisation.attr('cx');
                vertexVisualisation.oy = vertexVisualisation.attr('cy');
                vertexEdges.map(function(item) {
                    item.activate();
                });
            }

            /**
             * Callback which is used during the dragging of a Raphael shape.
             */
            function dragging(dx, dy) {
                var newX = vertexVisualisation.ox + dx;
                var newY = vertexVisualisation.oy + dy;
                setPosition(newX, newY);
            }

            /**
             * Callback which is used when dragging the Raphael shape ends.
             */
            function endDrag() {
                // restore original state
                vertexEdges.map(function(item) {
                    item.deactivate();
                });
            }

            // set the callbacks
            vertexVisualisation.drag(dragging, startDrag, endDrag);

            /**
             * function which changes the attributes of the visualisation upon
             * activation.
             */
            function activate() {
                vertexVisualisation.attr( {
                    fill : configuration.activeVertexColor
                });
            }

            /**
             * function which changes the attributes of the visualisation upon
             * deactivation.
             */
            function deactivate() {
                vertexVisualisation.attr( {
                    fill : configuration.inactiveVertexColor
                });
            }

            /**
             * The vertex object.
             */
            var vertex = {
                toFront : toFront,
                setPosition : setPosition,
                addEdge : addEdge,
                x : x,
                y : y,
                getPositionString : getPositionString,
                activate : activate,
                deactivate : deactivate
            };

            return vertex;
        }

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
            var edgeVisualisation = raphaelPaper.path().attr( {
                'stroke-width' : configuration.edgeStrokeWidth
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
                edgeVisualisation.attr( {
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

                function intersect(secondFunction) {
                    var A2 = secondFunction.A;
                    var B2 = secondFunction.B;
                    var C2 = secondFunction.C;
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
             * This function checks if the given point lies on the edge
             * (excludung the endpoints) and returns true on success, false
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
                edgeVisualisation.attr( {
                    stroke : configuration.activeEdgeColor
                });
                startVertex.activate();
                endVertex.activate();
            }

            function deactivate() {
                edgeVisualisation.attr( {
                    stroke : configuration.inactiveEdgeColor
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
                belongsToEdge : belongsToEdge
            };

            // add a reference of the edge to both connected vertices.
            startVertex.addEdge(edge);
            endVertex.addEdge(edge);
            // add the edge to the applications edge list
            edgeArray.push(edge);

            return edge;
        }

        /**
         * return an object containing all the factory methods
         */
        return {
            createVertex : createVertex,
            createEdgeBetween : createEdgeBetween
        };
    }

    /**
     * This function initialises the variable raphaelPaper and kicks of the
     * application.
     */
    function init(divName) {
        var divElement = document.getElementById(divName);
        divElement.style.width = configuration.xSize + 'px';
        divElement.style.height = configuration.ySize + 'px';
        raphaelPaper = Raphael(divName, configuration.xSize, configuration.ySize);
        delete divElement;

        factories = createFactories(raphaelPaper);

        createGraph();

        arrangeVerticesInCircle();
    }

    /**
     * This function creates the graph.
     */
    function createGraph() {
        vertexArray.push(factories.createVertex());
        vertexArray.push(factories.createVertex());
        vertexArray.push(factories.createVertex());
        vertexArray.push(factories.createVertex());
        vertexArray.push(factories.createVertex());
        vertexArray.push(factories.createVertex());
        vertexArray.push(factories.createVertex());

        factories.createEdgeBetween(vertexArray[0], vertexArray[1]);
        factories.createEdgeBetween(vertexArray[1], vertexArray[2]);
        factories.createEdgeBetween(vertexArray[1], vertexArray[3]);
        factories.createEdgeBetween(vertexArray[1], vertexArray[4]);
        factories.createEdgeBetween(vertexArray[1], vertexArray[5]);
        factories.createEdgeBetween(vertexArray[1], vertexArray[6]);
        factories.createEdgeBetween(vertexArray[2], vertexArray[3]);
        factories.createEdgeBetween(vertexArray[3], vertexArray[4]);
        factories.createEdgeBetween(vertexArray[4], vertexArray[5]);
        factories.createEdgeBetween(vertexArray[5], vertexArray[6]);
        factories.createEdgeBetween(vertexArray[6], vertexArray[0]);
        factories.createEdgeBetween(vertexArray[0], vertexArray[4]);
        factories.createEdgeBetween(vertexArray[2], vertexArray[4]);

        vertexArray.map(function(vertex) {
            vertex.toFront();
        });
    }

    /**
     * This function aranges all vertices stored in vertexArray in a circle.
     */
    function arrangeVerticesInCircle() {
        var arrayLength = vertexArray.length;
        var angleDelta = 2 * Math.PI / arrayLength;
        var hypothenuse = Math.min(configuration.xSize, configuration.ySize) / 2 - 10;

        for ( var vertexIndex = 0; vertexIndex < arrayLength; vertexIndex++) {
            var currentVertex = vertexArray[vertexIndex];
            var currentAngle = vertexIndex * angleDelta;

            // calculate the new x and y position and add an offset to translate
            // it into the middle of the canvas
            var newX = Math.cos(currentAngle) * hypothenuse + configuration.xSize / 2;
            var newY = Math.sin(currentAngle) * hypothenuse + configuration.ySize / 2;

            currentVertex.setPosition(newX, newY);
        }
    }

    /**
     * This function checks if the edges of the graph intersect.
     */
    function checkEdgeIntersection() {
        var edges = edgeArray.slice();
        var intersections = [];
        while (1 < edges.length) {
            var currentEdge = edges.pop();

            intersections.push.apply(intersections, edges.filter(function(edge) {
                return edge.intersectWith(currentEdge);
            }));
        }
        if (0 < intersections.length)
            alert('There are ' + intersections.length + ' intersections');
    }

    /**
     * Return an object containing all the public methods of JSPlanarity.
     */
    return {
        init : init,
        checkSolution : checkEdgeIntersection
    };
}(Raphael));
