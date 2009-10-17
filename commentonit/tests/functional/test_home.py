from commentonit.tests import *

class TestHomeController(TestController):

    def test_index(self):
        response = self.app.get(url('home'))
        assert 'Comment on It' in response

    def test_annotate(self):
        res = self.app.get(url('annotate'))
        assert 'Annotate' in res
        assert 'jsannotate.min.css' in res
    
    sonnet = '''Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date:
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd,
And every fair from fair sometime declines,
By chance, or nature's changing course untrimm'd: 
But thy eternal summer shall not fade,
Nor lose possession of that fair thou ow'st,
Nor shall death brag thou wander'st in his shade,
When in eternal lines to time thou grow'st,
  So long as men can breathe, or eyes can see,
  So long lives this, and this gives life to thee.
'''

    def test_app(self):
        res = self.app.get(url('home'))
        form = res.forms[0]
        form['text'] = self.sonnet
        res = form.submit()
        assert 'Annotate' in res 
        assert self.sonnet.split()[0] in res, res
        assert '<pre' in res

