import logging

from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort, redirect_to

from commentonit.lib.base import BaseController, render

log = logging.getLogger(__name__)

import annotator.middleware
media_mount_path = '.js-annotate'
server_api = '/'
anno_middleware = annotator.middleware.JsAnnotateMiddleware(None,
        media_mount_path, server_api)

class HomeController(BaseController):

    def index(self):
        return render('index.html')

    def annotate(self):
        # TODO: create text in the backend ...
        text = request.params.get('text', '')
        c.content = '<pre>%s</pre>' % text
        out = render('annotate.html')
        out = anno_middleware.modify_html(out)
        return out

