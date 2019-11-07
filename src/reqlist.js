let reqsList = [];

function prepare_reqlist(config, document) {
  const nodeIterator = document.createNodeIterator(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        if (!/^\s*$/.test(node.data)) {
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    }
  );

  let node;
  while ((node = nodeIterator.nextNode())) {
    if (/MUST|REQUIRED|SHOULD|RECOMMENDED/.test(node.data)) {
      const statesList = /:\s*$/.test(node.parentElement.textContent);
      const section = node.parentElement.closest("section");
      const header = section.querySelector("h1,h2,h3,h4,h5,h6,h7,h8,h9");
      const extracts = [];
      extracts.push(node.parentElement);
      if (statesList) {
        extracts.push(node.parentElement.nextElementSibling);
      }

      reqsList.push({ section, header, extracts });
    }
  }
}

let reqlistRendered = false;

function add_reqlist_button(config, document) {
  const respecUI = document.querySelector("#respec-ui");

  const anchor = document.createElement("button");
  anchor.id = "reqlist-pill";
  anchor.className = "respec-info-button";
  anchor.setAttribute("aria-label", "Open ReqList");
  anchor.textContent = "ReqList";

  anchor.addEventListener("click", () => {
    if (!reqlistRendered) {
      render_requirements_list(config, document);
      reqlistRendered = true;
    }

    window.location.href = "#list-of-requirements";
  });

  respecUI.appendChild(anchor);
}

function render_requirements_list(config, document) {
  const toc = document.querySelector("#toc");

  const lorHeader = document.createElement("h2");
  lorHeader.className = "removeOnSave";
  lorHeader.id = "list-of-requirements";
  lorHeader.textContent = "List of Requirements";
  toc.appendChild(lorHeader);

  const lor = document.createElement("ol");
  lor.className = "reqlist removeOnSave";
  toc.appendChild(lor);

  reqsList.forEach(req => {
    const item = document.createElement("li");
    item.className = "reqlist-item";
    const anchor = document.createElement("a");
    anchor.href = "#" + req.section.id;
    const respecHeader = req.section.querySelector(
      "h1,h2,h3,h4,h5,h6,h7,h8,h9"
    );
    if (respecHeader) {
      const header = respecHeader.cloneNode(true);
      const selfLink = header.querySelector("a.self-link");
      if (selfLink) {
        selfLink.remove();
      }
      anchor.innerHTML = header.innerHTML;
    } else {
      console.warn("No header found for requirement?", req.section, req.header);
    }

    item.appendChild(anchor);

    req.extracts.forEach(extract => {
      const element = extract.cloneNode(true);
      element.addEventListener("click", () => {
        extract.scrollIntoView();
      });
      item.appendChild(element);
    });

    lor.appendChild(item);
  });
}
