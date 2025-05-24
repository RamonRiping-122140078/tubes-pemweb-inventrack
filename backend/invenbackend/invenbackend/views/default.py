from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import SQLAlchemyError

from .. import models

@view_config(route_name='home', renderer='invenbackend:templates/mytemplate.jinja2')
def my_view(request):
    try:
        # Just get the first Barang entry from the DB
        first_barang = request.dbsession.query(models.Barang).first()
        if not first_barang:
            return Response("No Barang found in the database.", content_type='text/plain')
    except SQLAlchemyError:
        return Response("Database error occurred.", content_type='text/plain', status=500)

    # Return it to the template
    return {'one': first_barang, 'project': 'invenbackend'}
