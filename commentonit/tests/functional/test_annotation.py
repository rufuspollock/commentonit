from commentonit.tests import *

class TestAnnotationController(TestController):

    def test_index(self):
        response = self.app.get(url(controller='annotation', action='index'))
        # Test response...
