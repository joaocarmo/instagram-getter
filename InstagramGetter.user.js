// ==UserScript==
// @name         Instagram Getter
// @namespace    http://joaocarmo.com/
// @version      0.3.1
// @description  Instagram post page image getter
// @source       https://github.com/joaocarmo/instagram-getter
// @updateURL    https://raw.githubusercontent.com/joaocarmo/instagram-getter/master/InstagramGetter.meta.js
// @downloadURL  https://raw.githubusercontent.com/joaocarmo/instagram-getter/master/InstagramGetter.user.js
// @author       joaocarmo
// @match        https://www.instagram.com/p/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at       document-idle
// ==/UserScript==

'use strict';

// Tweaks
var removeIframes = true;

// Settings
var preventModals = true;
var runAfter = 2000;
var mainAppID = 'igetter-menu';
var appTitle = 'Instagram Getter';
var menuButtonDisplay = 'IGetter';
var loadingID = mainAppID + '-loading';
var loadingText = 'Loading...';
var menuText = 'Image {idx}';
var menuButtonStyle = {
  width: '35px',
  height: '35px',
  position: 'fixed',
  top: '22px',
  right: getButtonPosition() + 'px',
  color: 'black',
  backgroundColor: 'white',
  display: 'table',
  border: '1px solid lightgrey',
  borderRadius: '20px',
  cursor: 'pointer',
  userSelect: 'none'
};
var menuButtonStyleHover = {
  border: '1px solid darkgrey',
};
var menuButtonContentStyle = {
  display: 'table-cell',
  textAlign: 'center',
  verticalAlign: 'middle',
  fontFamily: 'sans-serif',
  fontSize: '10px',
  fontWeigth: 'bold'
};
var menuStyle = {
  backgroundColor: 'white',
  width: '160px',
  position: 'fixed',
  top: '80px',
  right: getMenuPosition() + 'px',
  padding: '10px',
  border: '1px solid lightgrey',
  borderRadius: '4px',
  opacity: '1.0',
  visibility: 'hidden'
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
var counter = {
  avatar: 0,
  image: 0,
  video: 0,
};

function debugInfo(msg) {
  var output = window.console.log;
  if (window && window.console && typeof window.console.info === 'function') {
    output = window.console.info;
  }
  output(msg);
}

function applyTweaks() {
  if (typeof $ === 'function') {
    if (removeIframes) {
      var iFrames = $('iframe').remove();
    }
  }
}

function getSources(imgElements) {
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

function createMenu() {
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

function getDescription(index, element, isVideo) {
  if (isVideo) {
    counter.video = counter.video + 1;
    return 'Post Video ' + counter.video;
  }
  var description = menuText.replace('{idx}', index);
  if (element && (element.height > 16 || element.width > 16)) {
    if (element.width > 150 || element.width > 150) {
      counter.image = counter.image + 1;
      description = 'Post Image ' + counter.image;
    }
    if (element.width < 150 || element.width < 150) {
      counter.avatar = counter.avatar + 1;
      description = 'Avatar';
    }
  }
  return description;
}

function addMenuEntry(src, idx, element, isVideo) {
  var srcNum = idx + 1;
  var igMenu = document.getElementById(mainAppID);
  var menuEntry = document.createElement('div');
  menuEntry.id = mainAppID + '-entry-' + srcNum;
  menuEntry = applyStyle(menuEntry, entryStyle);
  var menuEntryLink = document.createElement('a');
  var description = getDescription(srcNum, element, isVideo);
  var menuEntryLinkContent = document.createTextNode(description);
  menuEntryLink.href = src;
  menuEntryLink.target = '_blank';
  menuEntryLink.alt = '';
  menuEntryLink.appendChild(menuEntryLinkContent);
  menuEntry.appendChild(menuEntryLink);
  igMenu.appendChild(menuEntry);
}

function createMenuButton() {
  // Create menu button
  var newMenuButton = document.createElement('div');
  newMenuButton.id = mainAppID + '-button';
  newMenuButton = applyStyle(newMenuButton, menuButtonStyle);
  var menuButtonContent = document.createElement('div');
  menuButtonContent.id = mainAppID + '-button-content';
  menuButtonContent = applyStyle(menuButtonContent, menuButtonContentStyle);
  var menuButtonContentText = document.createTextNode(menuButtonDisplay);
  menuButtonContent.appendChild(menuButtonContentText);
  newMenuButton.appendChild(menuButtonContent);
  newMenuButton.addEventListener('click', showHideMenu);
  newMenuButton.addEventListener('mouseenter', mouseHoverOn);
  newMenuButton.addEventListener('mouseleave', mouseHoverOff);
  newMenuButton.addEventListener('dblclick', reloadMenu);
  // Append menu button
  document.body.appendChild(newMenuButton);
}

function mouseHoverOn() {
  var igMenuButton = document.getElementById(mainAppID + '-button');
  igMenuButton = applyStyle(igMenuButton, menuButtonStyleHover);
}

function mouseHoverOff() {
  var igMenuButton = document.getElementById(mainAppID + '-button');
  igMenuButton = applyStyle(igMenuButton, menuButtonStyle);
}

function showHideMenu() {
  var igMenu = document.getElementById(mainAppID);
  var igStyle = window.getComputedStyle(igMenu);
  var visibility = igStyle.getPropertyValue('visibility');
  var newVisibility = 'visible';
  if (visibility === newVisibility) {
    newVisibility = 'hidden';
  }
  igMenu.style.visibility = newVisibility;
}

function destroyMenu() {
  var menu = document.getElementById(mainAppID);
  if (menu) {
    menu.parentNode.removeChild(menu);
  }
}

// The main function to be called from another place
function main() {
  var imgElements;
  var videoElements;
  // Grab all img elements
  if (typeof $ === 'function') {
    imgElements = $('img');
  } else {
    imgElements = document.getElementsByTagName('img');
  }
  // Grab all video elements
  if (typeof $ === 'function') {
    videoElements = $('video');
  } else {
    videoElements = document.getElementsByTagName('video');
  }
  // Do it for images
  var imgs = getSources(imgElements);
  var srcs = imgs.srcs;
  var elements = imgs.elements;
  srcs.forEach((src, idx) => addMenuEntry(src, idx, elements[idx]));
  // Do ir for videos
  var vids = getSources(videoElements);
  var vidsSrcs = vids.srcs;
  var vidsElements = vids.elements;
  vidsSrcs.forEach((src, idx) => addMenuEntry(src, idx, vidsElements[idx], true));
  hideLoading();
}

function reload() {
  // Build the menu
  createMenu();
  // Execute the code only after a certain time
  setTimeout(main, runAfter);
}

function reloadMenu() {
  destroyMenu();
  reload();
}

function getButtonPosition() {
  var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  return Math.ceil( width / 2 ) - 170;
}

function getMenuPosition() {
  return getButtonPosition() - 70;
}

function setNewPositions() {
  var buttonPosition = getButtonPosition();
  var menuPosition = getMenuPosition();
  var igMenuButton = document.getElementById(mainAppID + '-button');
  var igMenu = document.getElementById(mainAppID);
  igMenuButton.style.right = buttonPosition + 'px';
  igMenu.style.right = menuPosition + 'px';
}

(function() {
  debugInfo('The userscript "Instagram Getter" is active !');
  // Build the menu button
  createMenuButton();
  reload();
  applyTweaks();
  // Make sure the button is dynamically positioned
  window.addEventListener('resize', function(event) {
    setNewPositions();
  });
})();
