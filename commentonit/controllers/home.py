import logging

from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort, redirect_to

from commentonit.lib.base import BaseController, render

log = logging.getLogger(__name__)

class HomeController(BaseController):

    def index(self):
        return render('index.html')

    def annotate(self):
        # TODO: create text in the backend ...
        text = request.params.get('text', '')
        c.content = '<pre>%s</pre>' % text
        return render('annotate.html')

