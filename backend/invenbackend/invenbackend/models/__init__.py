from sqlalchemy import engine_from_config
from .meta import Base, DBSession
from .mymodel import MyModel
from .inventrack import Supplier, Barang, User

__all__ = ['Base', 'MyModel', 'Supplier', 'Barang', 'User']

def get_engine(settings):
    from sqlalchemy import engine_from_config
    return engine_from_config(settings, prefix='sqlalchemy.')

def get_session_factory(engine):
    DBSession.configure(bind=engine)
    return DBSession

def get_tm_session(session_factory, transaction_manager):
    dbsession = session_factory()
    dbsession.expire_on_commit = False
    return dbsession
