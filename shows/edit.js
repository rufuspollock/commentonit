function(doc, req) {  
  var ddoc = this;
  var Mustache = require("vendor/couchapp/lib/mustache");
  var path = require("vendor/couchapp/lib/path").init(req);

  var indexPath = path.asset('index.html');

  var data = {
    header : {
      indexPage : indexPath,
      blogName : ddoc.couchapp.name,
    },
    scripts : {},
    pageTitle : doc ? "Edit: "+doc.title : "Create new document",
    assets : path.asset()
  };
  
  if (doc) {
    data.doc = JSON.stringify(doc);
    data.title = doc.title;
    data.body = doc.body;
    data.tags = doc.tags.join(", ");
  } else {
    data.doc = JSON.stringify({
      type : "post",
      format : "markdown"
    });
  }

  return Mustache.to_html(ddoc.templates.edit, data, ddoc.templates.partials);
}
