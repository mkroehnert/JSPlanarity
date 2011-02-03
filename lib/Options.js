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
 * @fileOverview Contains a RequireJS module which returns an object containing configuration options.
 * @author <a href="mailto:mkroehnert@users.sourceforge.net">Manfred Kroehnert</a> 
 * @version 0.0
 */

define({
    drawingDivName : 'PlanarityArea',
    xSize : '600',
    ySize : '600',
    vertexRadius : 7,
    inactiveVertexColor : '#00F',
    activeVertexColor : '#0F0',
    edgeStrokeWidth : '2',
    inactiveEdgeColor : '#000',
    activeEdgeColor : '#FFF',
    intersectionEdgeColor : '#F00',
    randomMinValue : 0,
    randomMaxValue : 20,
    startupAnimationTimeMs : 700,
    difficulty : 4
});
