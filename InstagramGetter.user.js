// ==UserScript==
// @name         Instagram Getter
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Instagram post page image getter
// @source       https://github.com/joaocarmo/instagram-getter
// @updateURL    https://raw.githubusercontent.com/joaocarmo/instagram-getter/master/InstagramGetter.meta.js
// @downloadURL  https://raw.githubusercontent.com/joaocarmo/instagram-getter/master/InstagramGetter.user.js
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
      borderRadius: '4px',
      opacity: '0.7'
    };
    var titleStyle = {
      fontWeigth: 'bold',
      padding: '5px',
      borderBottom: '1px solid lightgrey',
      marginBottom: '5px'
    };
    var closeStyle = {
      position: 'absolute',
      top: '5px',
      right: '10px',
      color: 'red',
      cursor: 'pointer',
      fontFamily: 'sans-serif',
      fontSize: '12px'
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
        var elements = [];
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
            elements.push(imgElement);
        }
        return {
          srcs: srcs,
          elements: elements
        };
    }

    function applyStyle(element, style) {
      Object.keys(style).forEach(function(key) {
        element.style[key] = style[key];
      });
      return element;
    }

    function closeMenu(event) {
      var menu = document.getElementById(mainAppID);
      menu.parentNode.removeChild(menu);
    }

    function showMenu() {
      // Create menu
      var newMenu = document.createElement('div');
      newMenu.id = mainAppID;
      newMenu = applyStyle(newMenu, menuStyle);
      // Create menu title
      var menuTitle = document.createElement('div');
      menuTitle.id = mainAppID + '-title';
      menuTitle = applyStyle(menuTitle, titleStyle);
      var newTitleContent = document.createTextNode(appTitle);
      menuTitle.appendChild(newTitleContent);
      // Create close button
      var closeButton = document.createElement('span');
      closeButton.id = mainAppID + '-close';
      closeButton = applyStyle(closeButton, closeStyle);
      closeButton.addEventListener('click', closeMenu);
      var closeButtonContent = document.createTextNode('X');
      closeButton.appendChild(closeButtonContent);
      newMenu.appendChild(closeButton);
      // Create loader
      var menuLoading = document.createElement('div');
      menuLoading.id = loadingID;
      menuLoading = applyStyle(menuLoading, loadingStyle);
      var menuLoadingContent = document.createTextNode(loadingText);
      menuLoading.appendChild(menuLoadingContent);
      newMenu.appendChild(menuTitle);
      newMenu.appendChild(menuLoading);
      // Append menu
      document.body.appendChild(newMenu);
    }

    function hideLoading() {
      var igMenuLoading = document.getElementById(loadingID);
      igMenuLoading.parentNode.removeChild(igMenuLoading);
    }

    function getDescription(index, element) {
      var description = menuText.replace('{idx}', index);
      if (element && (element.height > 16 || element.width > 16)) {
        if (element.width > 150 || element.width > 150) {
          description = 'Post Image';
        }
        if (element.width < 150 || element.width < 150) {
          description = 'Avatar';
        }
      }
      return description;
    }

    function addMenuEntry(src, idx, element) {
      var srcNum = idx + 1;
      var igMenu = document.getElementById(mainAppID);
      var menuEntry = document.createElement('div');
      menuEntry.id = mainAppID + '-entry-' + srcNum;
      menuEntry = applyStyle(menuEntry, entryStyle);
      var menuEntryLink = document.createElement('a');
      var description = getDescription(srcNum, element);
      var menuEntryLinkContent = document.createTextNode(description);
      menuEntryLink.href = src;
      menuEntryLink.target = '_blank';
      menuEntryLink.alt = '';
      menuEntryLink.appendChild(menuEntryLinkContent);
      menuEntry.appendChild(menuEntryLink);
      igMenu.appendChild(menuEntry);
    }

    // The main function to be called from another place
    function main() {
        var imgs = getSources(imgElements);
        var srcs = imgs.srcs;
        var elements = imgs.elements;
        hideLoading();
        srcs.forEach((src, idx) => addMenuEntry(src, idx, elements[idx]));
    }

    console.warn('The user script "Instagram Getter" is active !');
    // Build the menu
    showMenu();
    // Execute the code only after a certain time
    setTimeout(main, runAfter);

})();
