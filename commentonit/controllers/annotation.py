import logging

from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort, redirect_to

from commentonit.lib.base import BaseController, render

log = logging.getLogger(__name__)

from annotator.store import AnnotatorStore

# mounting it at annotation in pylons is a bit 'clever'
# we're not stripping off script_name at the moment from path
# and annotation is the offset within Store for annotation objects
AnnotationController = AnnotatorStore

