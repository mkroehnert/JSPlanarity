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
 * @fileOverview Contains a RequireJS module which is used to create vertices.
 * @author <a href="mailto:mkroehnert@users.sourceforge.net">Manfred Kroehnert</a> 
 * @version 0.0
 */

define(['RaphaelCanvas', 'Options'], function(raphaelCanvas, options) {
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
        var vertexVisualisation = raphaelCanvas.circle(xpos || options.xSize / 2,
                ypos || options.ySize / 2, options.vertexRadius).attr({
            fill : options.inactiveVertexColor
        }).onAnimation(updateEdges);
    
        /**
         * This function moves the vertex visualisation to the front of the
         * canvas.
         */
        function toFront() {
            vertexVisualisation.toFront();
        }
    
        /**
         * Update the edges connected to the vertex.
         */
        function updateEdges() {
            vertexEdges.map(function(item) {
                item.updateVisualisation();
            });
        }
    
        /**
         * Function to set a e new position for the vertex. If animationTime
         * is 0 the position is set immediately otherwise it is animated
         * within animationTimeMs.
         */
        function setPosition(x, y, animationTimeMs) {
            // respect the canvas limits
            var newX = Math.max(0, x);
            newX = Math.min(newX, options.xSize);
            var newY = Math.max(0, y);
            newY = Math.min(newY, options.ySize);
            var newAnimationTimeMs = animationTimeMs || 0;
            // set to 0 if newAnimationTime is lower than 0
            newAnimationTimeMs = Math.max(newAnimationTimeMs, 0);
    
            vertexVisualisation.animate({
                cx : newX,
                cy : newY
            }, newAnimationTimeMs, "bounce", updateEdges);
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
            vertexVisualisation.attr({
                fill : options.activeVertexColor
            });
        }
    
        /**
         * function which changes the attributes of the visualisation upon
         * deactivation.
         */
        function deactivate() {
            vertexVisualisation.attr({
                fill : options.inactiveVertexColor
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
    
    var vertexFactory = {createVertex: createVertex};
    
    return vertexFactory;
});