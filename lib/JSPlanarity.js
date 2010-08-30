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
         * Create a vertex at position (xpos, ypos).
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
             * The vertex object.
             */
            var Vertex = {
                setPosition : setPosition
            };

            return Vertex;
        }

        return {
            createVertex : createVertex
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
    }

    /**
     * Return an object containing all the public methods of JSPlanarity.
     */
    return {
        init : init
    };
}(Raphael));
