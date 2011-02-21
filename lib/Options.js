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
 * @fileOverview Contains a RequireJS module which returns a preferences object (uses localStorage when available).
 * @author <a href="mailto:mkroehnert@users.sourceforge.net">Manfred Kroehnert</a> 
 * @version 0.0
 */

define(['DefaultOptions'], function(defaultOptions) {
    var hasLocalStorage = ('undefined' !== typeof(localStorage));
    var listenerMap = {};
    
    var getItem = function(itemName) {
        return localStorage[itemName];
    }
    
    var setItem = function(itemName, itemValue) {
        localStorage[itemName] = itemValue;
    }
    
    var hasItem = function(itemName) {
        if (localStorage[itemName])
            return true;
        else
            return false;
    }
    
    var addListenerForItem = function(itemName, observerFunction) {
        if (listenerMap[itemName])
            listenerMap[itemName].push(observerFunction);
        else
            listenerMap[itemName] = [observerFunction];
    }
    
    var clear = function() {
        localStorage.clear();
    }
    
    function storage_handler(event) {
        if (listenerMap[event.key])
            listenerMap[event.key].forEach(function(observerFunction) {observerFunction();});
//        { event.key,
//          event.oldValue,
//          event.newValue }
    }
    
    var preferencesObject = {
        getItem: function(name) {return defaultOptions[name];},
        setItem: function(itemName, itemValue) {console.log('Preference Value not permanent!');},
        hasItem: function() {if (defaultOptions[name]) return true; else return false;},
        addListenerForItem: function() {console.log('Preference Value not permanent!');},
        clear: function() {}
    }
    
    if (hasLocalStorage) {
        for (var key in defaultOptions) {
            if (!hasItem(key)) {
                setItem(key, defaultOptions[key]);
            }
        }
    
        preferencesObject.getItem = getItem;
        preferencesObject.setItem = setItem;
        preferencesObject.hasItem = hasItem;
        preferencesObject.addListenerForItem = addListenerForItem;
        preferencesObject.clear = clear;
        
        window.addEventListener('storage', storage_handler, false);
    }
    
    return preferencesObject;
});
