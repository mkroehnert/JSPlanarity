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
        radius : 7
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
             * Holds the visualisation of the vertex.
             */
            var vertexVisualisation = raphaelPaper.circle(xpos || 0, ypos || 0,
                    configuration.radius).attr( {
                fill : '#0F0'
            });

            /**
             * Function to set a e new position for the vertex.
             */
            function setPosition(x, y) {
                vertexVisualisation.attr( {
                    cx : x,
                    cy : y
                });
            }

            /**
             * Function to return the position of the vertex as a string.
             */
            function getPositionString() {
                return '' + vertexVisualisation.attr('cx') + ' '
                        + vertexVisualisation.attr('cy');
            }

            /**
             * The vertex object.
             */
            var vertex = {
                setPosition : setPosition,
                getPositionString : getPositionString
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
            var edgeVisualisation = raphaelPaper.path();
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
             * The Edge object.
             */
            var edge = {
                updateVisualisation : updateVisualisation
            };
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
        raphaelPaper = Raphael(divName, configuration.xSize,
                configuration.ySize);
        delete divElement;

        factories = createFactories(raphaelPaper);

        vertexArray.push(factories.createVertex());
        vertexArray.push(factories.createVertex());
        vertexArray.push(factories.createVertex());
        vertexArray.push(factories.createVertex());
        vertexArray.push(factories.createVertex());
        vertexArray.push(factories.createVertex());
        vertexArray.push(factories.createVertex());

        arrangeVerticesInCircle();
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
            var newX = Math.cos(currentAngle) * hypothenuse
                    + configuration.xSize / 2;
            var newY = Math.sin(currentAngle) * hypothenuse
                    + configuration.ySize / 2;

            currentVertex.setPosition(newX, newY);
        }
        factories.createEdgeBetween(vertexArray[1], vertexArray[2]);
        factories.createEdgeBetween(vertexArray[2], vertexArray[3]);
        factories.createEdgeBetween(vertexArray[3], vertexArray[4]);
        factories.createEdgeBetween(vertexArray[4], vertexArray[5]);
        factories.createEdgeBetween(vertexArray[5], vertexArray[1]);
    }

    /**
     * Return an object containing all the public methods of JSPlanarity.
     */
    return {
        init : init
    };
}(Raphael));