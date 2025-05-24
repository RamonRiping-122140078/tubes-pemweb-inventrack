from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker, scoped_session
from .models.meta import Base  # Your Base from models/meta.py

# Create a global session factory variable
DBSession = scoped_session(sessionmaker())

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application """
    # Setup SQLAlchemy engine using settings from .ini config file
    engine = engine_from_config(settings, 'sqlalchemy.')
    # Bind the engine to the session
    DBSession.configure(bind=engine)
    # Bind metadata to the engine (optional, for reflection or creating tables)
    Base.metadata.bind = engine

    with Configurator(settings=settings) as config:
        # Add 'dbsession' property to Pyramid's request object
        config.add_static_view(name='static', path='invenbackend:static')
        config.add_request_method(lambda r: DBSession(), 'dbsession', reify=True)

        config.include('pyramid_jinja2')
        config.include('.routes')
        config.scan()
        return config.make_wsgi_app()
