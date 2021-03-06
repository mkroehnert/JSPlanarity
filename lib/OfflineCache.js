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
 * @fileOverview Contains a RequireJS module which contains a module to manage the applicationCache.
 * @author <a href="mailto:mkroehnert@users.sourceforge.net">Manfred Kroehnert</a> 
 * @version 0.0
 */

define([], function() {
    var webappCache = window.applicationCache;
    if (webappCache === undefined)
        return;

    function updateCache()
    {
        webappCache.swapCache();
        console.log('Offline cache updated');
    }
    
    function errorCache()
    {
        alert('Offline-Cache failed to update');
    }

    webappCache.addEventListener('error', errorCache, false);
//    webappCache.addEventListener('checking', errorCache, false);
//    webappCache.addEventListener('progress', errorCache, false);
//    webappCache.addEventListener('cached', errorCache, false);
//    navigator.onLine;
    webappCache.addEventListener('updateready', updateCache, false);
});
