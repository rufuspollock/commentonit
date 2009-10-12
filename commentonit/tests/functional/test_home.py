from commentonit.tests import *

class TestHomeController(TestController):

    def test_index(self):
        response = self.app.get(url('home'))
        assert 'Comment on It' in response

