import logging

from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort, redirect_to

from commentonit.lib.base import BaseController, render

log = logging.getLogger(__name__)

import annotator.middleware
media_mount_path = '/jsannotate'
server_api = '/'
anno_middleware = annotator.middleware.JsAnnotateMiddleware(None,
        media_mount_path, server_api)

class HomeController(BaseController):

    def index(self):
        return render('index.html')

    def annotate(self):
        c.prefix = server_api + 'annotation'
        c.uri = 'make one up'
        # TODO: create text in the backend ...
        text = request.params.get('text', '')
        import webhelpers.markdown as md
        if text:
            c.content = md.markdown(text)
        else:
            c.content = ''
        out = render('annotate.html')
        # out is a webhelpers.html.builder.literal
        # we want to work with raw html ...
        out = anno_middleware.modify_html(unicode(out))
        return out

