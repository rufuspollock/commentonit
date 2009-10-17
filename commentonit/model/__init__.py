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

import annotator.model
annotation_table = annotator.model.make_annotation_table(meta.metadata)
annotator.model.map_annotation_object(meta.Session.mapper, annotation_table)

class Repository(object):

    def create_db(self):
        '''Create the tables if they don't already exist'''
        meta.metadata.create_all(bind=meta.engine)

    def init_db(self):
        pass

repo = Repository()

## Non-reflected tables may be defined and mapped at module level
#foo_table = sa.Table("Foo", meta.metadata,
#    sa.Column("id", sa.types.Integer, primary_key=True),
#    sa.Column("bar", sa.types.String(255), nullable=False),
#    )
#
#class Foo(object):
#    pass
#
#orm.mapper(Foo, foo_table)


## Classes for reflected tables may be defined here, but the table and
## mapping itself must be done in the init_model function
#reflected_table = None
#
#class Reflected(object):
#    pass
