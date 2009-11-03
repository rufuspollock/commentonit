"""The application's model objects"""
import sqlalchemy as sa
from sqlalchemy import orm

from commentonit.model import meta

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
annotator.model.map_annotation_object(meta.Session.mapper, annotation_table)

## ---------------------------
## ..

import uuid
def make_uuid():
    return unicode(uuid.uuid4())

text_table = sa.Table('resource', meta.metadata,
    sa.Column('id', sa.types.UnicodeText, primary_key=True, default=make_uuid),
    sa.Column('title', sa.types.UnicodeText),
    sa.Column('uri', sa.types.UnicodeText),
    # types: url, (python) package, disk, inline (i.e. stored in payload)
    sa.Column('payload_type', sa.types.UnicodeText, default=u'db'),
    sa.Column('payload', sa.types.UnicodeText),
    sa.Column('format', sa.types.UnicodeText),
    )

user_table = sa.Table('user', meta.metadata,
    sa.Column('id', sa.types.UnicodeText, default=make_uuid),
    sa.Column('name', sa.types.UnicodeText),
    )

class Repository(object):

    def create_db(self):
        '''Create the tables if they don't already exist'''
        meta.metadata.create_all(bind=meta.engine)

    def init_db(self):
        pass

repo = Repository()


class Text(object):
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


class User(object):
    pass


mapper(Text, text_table, properties={
    'material':relation(Material, backref='resources')
    },
    order_by=resource_table.c.id
    )

