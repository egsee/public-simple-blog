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
        // 匹配的位置
        match = content.toLowerCase().indexOf(query.toLowerCase()),
        //  匹配字符串的长度
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
  
      // Create preview. match匹配的位置
      if (match >= 0) {
        // 匹配位置是否超过内容位置一半
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
  
    var excludesKey = ["url", "score"];
  
    var templateHtml =
      '<li style="margin-top:20px"><h3><a href="' +
      baseUrl +
      '{url}">{title}' +
      "</a></h3><p><small>" +
      "{content}" +
      "</small></p></li>";
    const searchInputEl = document.getElementById("search-input");
    const noResultsText =
      '<p style="text-align: center;margin-top: 30px">没有找到搜索结果</p>';
  
    function search(indexContent, query, fn) {
      const result = [];
      for (k in indexContent) {
        if (findObjMatch(indexContent[k], query)) {
          result.push(indexContent[k]);
        }
      }
      return fn(result, query);
    }
  
    function findObjMatch(obj, query) {
      for (key in obj) {
        if (excludesKey.indexOf(key) === -1) {
          var r =
            query
              .split(" ")
              .filter(
                (q) => obj[key].trim().toLowerCase().indexOf(q.toLowerCase()) >= 0
              ).length === query.split(" ").length;
          if (r) {
            obj.score = key === "title" ? 1000 : 1;
            return true;
          }
        }
      }
      return false;
    }
  
    search(data, query, (res, query) => {
      var contentHtml = "";
      res.sort(function (a, b) {
        return b.score - a.score;
      });
      res.map((item) => {
        var t = templateHtml;
        for (const key in item) {
          if (["title", "content"].indexOf(key) >= 0) {
            item[key] = getPreview(
              query,
              item[key],
              key === "title" ? null : 175
            );
          }
          if (excludesKey.indexOf(key) === -1) {
            t = t.replace(`{${key}}`, item[key]);
          }
        }
        contentHtml += t;
      });
      document.getElementById("results-container").innerHTML = contentHtml;
    });
  
    //   console.log(data);
    //   var sjs = SimpleJekyllSearch({
    //     searchInput: searchInputEl,
    //     resultsContainer: document.getElementById("results-container"),
    //     json: data,
    //     searchResultTemplate: templateHtml,
    //     noResultsText: noResultsText,
    //     score: { title: 1000 },
    //     templateMiddleware: function (prop, value, query) {
    //       if (prop == "content") {
    //         return getPreview(query, value, 150);
    //       }
    //       if (prop == "title") {
    //         return getPreview(query, value);
    //       }
    //     },
    //   });
    //   console.log("query", query);
    //   searchInputEl.setAttribute("value", query);
    //   query && sjs.search(query);
  })();
  