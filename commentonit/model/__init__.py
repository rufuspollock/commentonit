"""The application's model objects"""
from datetime import datetime

import sqlalchemy as sa
from sqlalchemy import orm

from commentonit.model import meta
from meta import Session
from sqlalchemy.orm import mapper
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base(metadata=meta.metadata)

def init_model(engine):
    """Call me before using any of the tables or classes in the model"""
    ## Reflected tables must be defined and mapped here
    #global reflected_table
    #reflected_table = sa.Table("Reflected", meta.metadata, autoload=True,
    #                           autoload_with=engine)
    #orm.mapper(Reflected, reflected_table)
    #
    meta.Session.configure(bind=engine)
    meta.engine = engine
    assert engine is not None

## ---------------------------
## Annotation stuff

import annotator.model
annotation_table = annotator.model.make_annotation_table(meta.metadata)
Annotation = annotator.model.Annotation
annotator.model.map_annotation_object(mapper, annotation_table)
# Correct for fact we aren't using Session.mapper but annotator expects it
# http://www.sqlalchemy.org/trac/wiki/UsageRecipes/SessionAwareMapper
Annotation.query = Session.query_property()


## ---------------------------
## Our Classes

import uuid
def make_uuid():
    return unicode(uuid.uuid4())

# have to define this before its use in Work object
work_2_user_table = sa.Table('work_2_user', meta.metadata,
    sa.Column('work_id', sa.types.UnicodeText, sa.ForeignKey('work.id'),
        primary_key=True),
    sa.Column('user_id', sa.types.UnicodeText, sa.ForeignKey('user.id'),
        primary_key=True)
    )


class Work(Base):
    __tablename__ = 'work'

    id = sa.Column(sa.types.UnicodeText, primary_key=True, default=make_uuid)
    created = sa.Column(sa.types.DateTime, default=datetime.now())
    title = sa.Column(sa.types.UnicodeText)
    uri = sa.Column(sa.types.UnicodeText)

    owners = orm.relation('User', secondary=work_2_user_table, backref='works')


class Text(Base):
    __tablename__ = 'text'

    id = sa.Column(sa.types.UnicodeText, primary_key=True, default=make_uuid)
    work_id = sa.Column(sa.types.UnicodeText, sa.ForeignKey('work.id'))
    created = sa.Column(sa.types.DateTime, default=datetime.now())
    # types: url, (python) package, disk, inline (i.e. stored in payload)
    payload_type = sa.Column(sa.types.UnicodeText, default=u'db')
    payload = sa.Column(sa.types.UnicodeText)
    format = sa.Column(sa.types.UnicodeText)

    work = orm.relation(Work, backref='texts')

    def get_stream(self):
        '''Get fileobj for content (if any) associated with this text.

        '''
        if self.payload_type == u'package':
            package, path = self.payload.split('::')
            import pkg_resources
            fileobj = pkg_resources.resource_stream(package, path)
            return fileobj
        elif self.payload_type == u'inline':
            from StringIO import StringIO
            return StringIO(self.payload)
        elif self.payload_type == u'disk':
            fp = open(self.payload)
            return open(fp)
        else:
            raise NotImplementedError


class User(Base):
    __tablename__ = 'user'

    id = sa.Column(sa.types.UnicodeText, primary_key=True, default=make_uuid)
    name = sa.Column(sa.types.UnicodeText)
    created = sa.Column(sa.types.DateTime, default=datetime.now())


class Repository(object):

    def create_db(self):
        '''Create the tables if they don't already exist'''
        meta.metadata.create_all(bind=meta.engine)

    def clean_db(self):
        meta.metadata.drop_all(bind=meta.engine)

    def init_db(self):
        pass

    def rebuild_db(self):
        self.clean_db()
        self.create_db()

repo = Repository()

