from pyramid.config import Configurator
from pyramid.events import NewRequest, NewResponse
from pyramid.events import subscriber
from sqlalchemy import engine_from_config
from .models.meta import DBSession, Base
from .models import get_engine, get_session_factory, get_tm_session

def add_cors_headers_response_callback(event):
    # Isi fungsi ini sesuai kebutuhan CORS kamu, contoh:
    response = event.response
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })

@subscriber(NewRequest)
def new_request_subscriber(event):
    event.request.add_finished_callback(lambda request: DBSession.remove())

def main(global_config, **settings):
    # Setup SQLAlchemy engine dan bind DBSession dan Base
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    session_factory = get_session_factory(engine)
    Base.metadata.bind = engine

    config = Configurator(settings=settings)
    
    # Daftarkan add_cors_headers_response_callback sebagai subscriber
    config.add_subscriber(add_cors_headers_response_callback, NewResponse)

    # Daftarkan cleanup DBSession saat request selesai
    config.add_subscriber(new_request_subscriber, NewRequest)
    
    config.registry['dbsession_factory'] = session_factory

    def dbsession_factory(request=None):
        session_factory = request.registry['dbsession_factory']
        return session_factory()
    
    config.add_request_method(dbsession_factory, 'dbsession', reify=True)

    # Static view, include jinja2 dan routes
    config.add_static_view(name='static', path='invenbackend:static')
    config.include('pyramid_jinja2')
    
    config.include('.routes')

    # Routes tambahan
    config.add_route('any_options', '/{path:.*}')

    config.scan()

    return config.make_wsgi_app()
