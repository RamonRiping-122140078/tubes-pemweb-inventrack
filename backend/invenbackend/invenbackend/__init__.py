from pyramid.config import Configurator
from pyramid.events import NewRequest, subscriber
from pyramid.response import Response
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker, scoped_session
from .models.meta import Base

DBSession = scoped_session(sessionmaker())

def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
            'Access-Control-Allow-Origin': 'http://localhost:5174',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
        })
        return response
    event.request.add_response_callback(cors_headers)

def main(global_config, **settings):
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine

    with Configurator(settings=settings) as config:
        config.add_static_view(name='static', path='invenbackend:static')
        config.add_request_method(lambda r: DBSession(), 'dbsession', reify=True)

        config.add_subscriber(add_cors_headers_response_callback, NewRequest)

        config.include('pyramid_jinja2')
        config.include('.routes')

        config.add_route('any_options', '/{path:.*}')
        
        import invenbackend.views.api  # pastikan modul views/api.py di-load 
        config.scan()

        return config.make_wsgi_app()

@subscriber(NewRequest)
def new_request_subscriber(event):
    event.request.add_finished_callback(lambda request: DBSession.remove())
