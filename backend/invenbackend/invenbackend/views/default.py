from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import SQLAlchemyError

from .. import models
import logging

log = logging.getLogger(__name__)

@view_config(route_name='home', renderer='invenbackend:templates/mytemplate.jinja2')
def my_view(request):
    try:
        barang_list = request.dbsession.query(models.Barang).all()
        supplier_list = request.dbsession.query(models.Supplier).all()
        user_list = request.dbsession.query(models.User).all()
        return {
        'project': 'InvenTrack',
        'barang_list': barang_list,
        'supplier_list': supplier_list,
        'user_list': user_list,
        }
    except SQLAlchemyError as e:
        log.error(f"Database error: {e}")
        return Response("Terjadi error pada database.", content_type='text/plain', status=500)

