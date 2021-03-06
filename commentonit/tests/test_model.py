from commentonit.tests import *

import commentonit.model as model

class TestModel:
    intext = u'''Hello world
    '''

    @classmethod
    def teardown_class(self):
        model.repo.rebuild_db()

    def test_work(self):
        title = u'Testing'
        work = model.Work(title=title)
        model.Session.add(work)
        user = model.User(name=u'tester')
        print work.owners
        work.owners.append(user)
        text = model.Text(work=work, payload_type=u'inline',
                payload=self.intext)

        model.Session.add(work)
        model.Session.add(user)
        model.Session.add(text)
        model.Session.commit()
        model.Session.remove()

        w = model.Session.query(model.Work).filter_by(title=title).one()
        assert w.title == title
        assert w.texts[0].payload == self.intext
        assert w.owners[0].name == u'tester'

