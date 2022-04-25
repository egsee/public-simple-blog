(function () {
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1),
      vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, "%20")).trim();
      }
    }
  }

  function getPreview(query, content, previewLength) {
    previewLength = previewLength || content.length * 2;

    var parts = query.split(" "),
      match = content.toLowerCase().indexOf(query.toLowerCase()),
      matchLength = query.length,
      preview;

    // Find a relevant location in content
    for (var i = 0; i < parts.length; i++) {
      if (match >= 0) {
        break;
      }

      match = content.toLowerCase().indexOf(parts[i].toLowerCase());
      matchLength = parts[i].length;
    }

    // Create preview
    if (match >= 0) {
      var start = match - previewLength / 2,
        end =
          start > 0 ? match + matchLength + previewLength / 2 : previewLength;

      preview = content.substring(start, end).trim();

      if (start > 0) {
        preview = "..." + preview;
      }

      if (end < content.length) {
        preview = preview + "...";
      }

      // Highlight query parts
      preview = preview.replace(
        new RegExp("(" + parts.join("|") + ")", "gi"),
        '<span class="highlight-search-key"><strong>$1</strong></span>'
      );
    } else {
      // Use start of content if no match found
      preview =
        content.substring(0, previewLength).trim() +
        (content.length > previewLength ? "..." : "");
    }

    return preview;
  }

  var query = decodeURIComponent(
    (getQueryVariable("q") || "").replace(/\+/g, "%20")
  );

  const templateHtml =
    '<li style="margin-top:20px"><h3><a href="' + baseUrl + '/{url}" title="{desc}">{title}' +
    "</a></h3><p><small>" +
    "{content}" +
    "</small></p></li>";
  const searchInputEl = document.getElementById("search-input");
  const noResultsText = '<p style="text-align: center;margin-top: 30px">没有找到搜索结果</p>'
  console.log(data)
  var sjs = SimpleJekyllSearch({
    searchInput: searchInputEl,
    resultsContainer: document.getElementById("results-container"),
    json: data,
    searchResultTemplate: templateHtml,
    noResultsText: noResultsText,
    templateMiddleware: function (prop, value, query) {
      if (prop == "content") {
        return getPreview(query, value, 150);
      }
      if (prop == "title") {
        return getPreview(query, value);
      }
    },
  });
  console.log("query", query);
  searchInputEl.setAttribute("value", query);
  query && sjs.search(query);
})();
