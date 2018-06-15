// ==UserScript==
// @name         Instagram Getter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  High res post image downloader
// @author       joaocarmo
// @match        https://www.instagram.com/p/*/
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    // Settings
    var runAfter = 2000;
    var mainAppID = 'igetter-menu';
    var appTitle = 'Instagram Getter';
    var loadingID = mainAppID + '-loading';
    var loadingText = 'Loading...';
    var menuText = 'Image {idx}';
    var menuStyle = {
      backgroundColor: 'white',
      width: '160px',
      position: 'fixed',
      top: '120px',
      left: '40px',
      padding: '10px',
      border: '1px solid lightgrey',
      borderRadius: '4px'
    };
    var titleStyle = {
      fontWeigth: 'bold',
      padding: '5px',
      borderBottom: '1px solid lightgrey',
      marginBottom: '5px'
    };
    var loadingStyle = {
      color: 'grey',
      padding: '5px'
    };
    var entryStyle = {
      padding: '5px'
    };

    // Grab all img elements
    var imgElements = document.getElementsByTagName('IMG');

    function getSources(elements) {
        // Store the srcs
        var srcs = [];
        // Loop through all the elements
        for (var i=0, N=imgElements.length; i<N; i++) {
            var imgElement = imgElements[i];
            if (imgElement) {
                if (imgElement.src) {
                    srcs.push(imgElement.src);
                } else if (imgElement.srcset) {
                    srcs.push(imgElement.srcset);
                } else if (imgElement.currentSrc) {
                    srcs.push(imgElement.currentSrc);
                } else {
                    try {
                        srcs.push(imgElement.attributes.ownerElement.src);
                    } catch(e) {
                        try {
                            srcs.push(imgElement.attributes.ownerElement.srcset);
                        } catch(e) {
                            try {
                                srcs.push(imgElement.attributes.ownerElement.currentSrc);
                            } catch(e) {
                                console.log(imgElement);
                            }
                        }
                    }
                }
            }
        }
        return srcs;
    }

    function applyStyle(element, style) {
      Object.keys(style).forEach(function(key) {
        element.style[key] = style[key];
      });
      return element;
    }

    function showMenu() {
      var newMenu = document.createElement('div');
      newMenu.id = mainAppID;
      newMenu = applyStyle(newMenu, menuStyle);
      var menuTitle = document.createElement('div');
      menuTitle.id = mainAppID + '-title';
      menuTitle = applyStyle(menuTitle, titleStyle);
      var newTitleContent = document.createTextNode(appTitle);
      menuTitle.appendChild(newTitleContent);
      var menuLoading = document.createElement('div');
      menuLoading.id = loadingID;
      menuLoading = applyStyle(menuLoading, loadingStyle);
      var menuLoadingContent = document.createTextNode(loadingText);
      menuLoading.appendChild(menuLoadingContent);
      newMenu.appendChild(menuTitle);
      newMenu.appendChild(menuLoading);
      document.body.appendChild(newMenu);
    }

    function hideLoading() {
      var igMenuLoading = document.getElementById(loadingID);
      igMenuLoading.parentNode.removeChild(igMenuLoading);
    }

    function addMenuEntry(src, idx) {
      var srcNum = idx + 1;
      var igMenu = document.getElementById(mainAppID);
      var menuEntry = document.createElement('div');
      menuEntry.id = mainAppID + '-entry-' + srcNum;
      menuEntry = applyStyle(menuEntry, entryStyle);
      var menuEntryLink = document.createElement('a');
      var menuEntryLinkContent = document.createTextNode(menuText.replace('{idx}', srcNum));
      menuEntryLink.href = src;
      menuEntryLink.target = '_blank';
      menuEntryLink.alt = '';
      menuEntryLink.appendChild(menuEntryLinkContent);
      menuEntry.appendChild(menuEntryLink);
      igMenu.appendChild(menuEntry);
    }

    // The main function to be called from another place
    function main() {
        var srcs = getSources(imgElements);
        hideLoading();
        srcs.forEach((src, idx) => addMenuEntry(src, idx));
    }

    console.warn('The user script "Instagram Getter" is active !');
    // Build the menu
    showMenu();
    // Execute the code only after a certain time
    setTimeout(main, runAfter);

})();
