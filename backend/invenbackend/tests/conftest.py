# conftest.py
import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, scoped_session

from invenbackend import main
from invenbackend.models import Base
from invenbackend.models.meta import Base as MetaBase, DBSession
import invenbackend.views.default  # pastikan views sudah diimpor

@pytest.fixture(scope='session')
def engine():
    return create_engine('sqlite:///:memory:')

@pytest.fixture(scope='session')
def tables(engine):
    # Buat semua tabel sebelum test dimulai
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def connection(engine, tables):
    connection = engine.connect()
    transaction = connection.begin()
    yield connection
    transaction.rollback()
    connection.close()

@pytest.fixture
def dbsession(connection):
    session_factory = sessionmaker(bind=connection)
    session = scoped_session(session_factory)

    # Nested transaction untuk rollback per test
    connection.begin_nested()

    @event.listens_for(session(), "after_transaction_end")
    def restart_savepoint(session_, transaction_):
        if transaction_.nested and not transaction_.connection.closed:
            session_.begin_nested()

    DBSession.configure(bind=connection)  # penting
    yield session
    session.remove()

@pytest.fixture
def testapp(dbsession, engine):
    DBSession.configure(bind=engine)
    # Setup settings yang benar
    settings = {
        'sqlalchemy.url': str(engine.url),
        'pyramid.includes': ['pyramid_tm'],  # penting agar request.tm ada
        'tm.manager_hook': 'pyramid_tm.explicit_manager',  # opsional tapi aman
        'testing': True,
        'debug_all': True,
        'debug_authorization': True,
        'debug_notfound': True,
        'debug_routematch': True
    }

    # Jalankan main() dari Pyramid, yang meng-include route & view
    app = main({}, **settings)

     # Override `request.dbsession` di konfigurasi Pyramid
    app.registry['dbsession_factory'] = lambda request: dbsession

    from webtest import TestApp
    return TestApp(app)
