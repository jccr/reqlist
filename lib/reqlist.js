"use strict";

var reqsList = [];

function prepare_reqlist(config, document) {
  var nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function acceptNode(node) {
      if (!/^\s*$/.test(node.data)) {
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  });
  var node;

  while (node = nodeIterator.nextNode()) {
    if (/MUST|SHOULD/.test(node.data)) {
      var statesList = /:\s*$/.test(node.parentElement.textContent);
      var section = node.parentElement.closest("section");
      var header = section.querySelector("h1,h2,h3,h4,h5,h6,h7,h8,h9");
      var extracts = [];
      extracts.push(node.parentElement);

      if (statesList) {
        extracts.push(node.parentElement.nextElementSibling);
      }

      reqsList.push({
        section: section,
        header: header,
        extracts: extracts
      });
    }
  }
}

var reqlistRendered = false;

function add_reqlist_button(config, document) {
  var respecUI = document.querySelector("#respec-ui");
  var anchor = document.createElement("button");
  anchor.id = "reqlist-pill";
  anchor.className = "respec-info-button";
  anchor.setAttribute("aria-label", "Open ReqList");
  anchor.textContent = "ReqList";
  anchor.addEventListener("click", function () {
    if (!reqlistRendered) {
      render_requirements_list(config, document);
      reqlistRendered = true;
    }

    window.location.href = "#list-of-requirements";
  });
  respecUI.appendChild(anchor);
}

function render_requirements_list(config, document) {
  var toc = document.querySelector("#toc");
  var lorHeader = document.createElement("h2");
  lorHeader.className = "removeOnSave";
  lorHeader.id = "list-of-requirements";
  lorHeader.textContent = "List of Requirements";
  toc.appendChild(lorHeader);
  var lor = document.createElement("ol");
  lor.className = "reqlist removeOnSave";
  toc.appendChild(lor);
  reqsList.forEach(function (req) {
    var item = document.createElement("li");
    item.className = "reqlist-item";
    var anchor = document.createElement("a");
    anchor.href = "#" + req.section.id;
    var respecHeader = req.section.querySelector("h1,h2,h3,h4,h5,h6,h7,h8,h9");

    if (respecHeader) {
      var header = respecHeader.cloneNode(true);
      var selfLink = header.querySelector("a.self-link");

      if (selfLink) {
        selfLink.remove();
      }

      anchor.innerHTML = header.innerHTML;
    } else {
      console.warn("No header found for requirement?", req.section, req.header);
    }

    item.appendChild(anchor);
    req.extracts.forEach(function (extract) {
      var element = extract.cloneNode(true);
      element.addEventListener("click", function () {
        extract.scrollIntoView();
      });
      item.appendChild(element);
    });
    lor.appendChild(item);
  });
}