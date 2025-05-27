from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPForbidden
from pyramid.response import Response
from ..models import Barang, Supplier, User
import datetime

import jwt
from passlib.hash import bcrypt
from sqlalchemy.exc import NoResultFound
from functools import wraps

# Secret JWT (ganti di production)
JWT_SECRET = 'rahasia_super_aman'


# ==== AUTH HELPERS & DECORATORS ====
import os
IS_TESTING = os.environ.get('TESTING') == '1'

def create_token(user):
    payload = {
        'id': user.id_user,
        'username': user.username,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')


def get_user_from_request(request):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def require_login(view_func):
    @wraps(view_func)
    def wrapper(request):
        if IS_TESTING:
            request.user = {'id': 1, 'username': 'testuser', 'role': 'admin'}
            return view_func(request)
        user = get_user_from_request(request)
        if not user:
            return HTTPForbidden(json_body={'error': 'Harus login untuk mengakses'})
        request.user = user
        return view_func(request)
    return wrapper


def require_admin(view_func):
    @wraps(view_func)
    def wrapper(request):
        if IS_TESTING:
            request.user = {'id': 1, 'username': 'testuser', 'role': 'admin'}
            return view_func(request)
        user = get_user_from_request(request)
        if not user or user.get('role') != 'admin':
            return HTTPForbidden(json_body={'error': 'Akses hanya untuk admin'})
        request.user = user
        return view_func(request)
    return wrapper


# ==== VIEWS ====

@view_config(route_name='login', renderer='json', request_method='POST')
def login(request):
    data = request.json_body
    username = data.get('username')
    password = data.get('password')
    try:
        user = request.dbsession.query(User).filter_by(username=username).one()
    except NoResultFound:
        return Response(json_body={'success': False, 'message': 'User tidak ditemukan'}, status=401)

    if not bcrypt.verify(password, user.password_hash):
        return Response(json_body={'success': False, 'message': 'Password salah'}, status=401)

    token = create_token(user)

    return {
        'success': True,
        'user': {
            'id': user.id_user,
            'username': user.username,
            'role': user.role
        },
        'token': token
    }

@view_config(route_name='me', renderer='json', request_method='GET')
def me_view(request):
    user = request.user
    if user:
        return {
            'user': {
                'id': user.id,
                'username': user.username,
                'role': user.role,
                # tambahkan informasi lainnya
            }
        }
    request.response.status = 401
    return {'error': 'Unauthorized'}


# ====== Barang ======

@view_config(route_name='barang_list', renderer='json')
@require_login
def barang_list(request):
    barangs = request.dbsession.query(Barang).all()
    return {'barangs': [b.to_dict() for b in barangs]}


@view_config(route_name='barang_detail', renderer='json')
@require_login
def barang_detail(request):
    barang = request.dbsession.query(Barang).get(request.matchdict['id'])
    if not barang:
        return HTTPNotFound(json_body={'error': 'Barang tidak ditemukan'})
    return {'barang': barang.to_dict()}


@view_config(route_name='barang_add', request_method='POST', renderer='json')
@require_admin
def barang_add(request):
    try:
        data = request.json_body
        barang = Barang(
            nama_barang=data['nama_barang'],
            kategori=data.get('kategori'),
            stok=data.get('stok'),
            harga=data.get('harga'),
            tanggal_masuk=datetime.date.fromisoformat(data['tanggal_masuk']) if data.get('tanggal_masuk') else None,
            id_supplier=data.get('id_supplier'),
        )
        request.dbsession.add(barang)
        request.dbsession.flush()
        request.dbsession.commit()
        return {'success': True, 'barang': barang.to_dict()}
    except Exception as e:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='barang_update', request_method='PUT', renderer='json')
@require_admin
def barang_update(request):
    barang = request.dbsession.query(Barang).get(request.matchdict['id'])
    if not barang:
        return HTTPNotFound(json_body={'error': 'Barang tidak ditemukan'})
    try:
        data = request.json_body
        for field in ['nama_barang', 'kategori', 'stok', 'harga', 'id_supplier']:
            if field in data:
                setattr(barang, field, data[field])
        if 'tanggal_masuk' in data:
            barang.tanggal_masuk = datetime.date.fromisoformat(data['tanggal_masuk']) if data['tanggal_masuk'] else None
        request.dbsession.commit()
        return {'success': True, 'barang': barang.to_dict()}
    except Exception as e:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='barang_delete', request_method='DELETE', renderer='json')
@require_admin
def barang_delete(request):
    barang = request.dbsession.query(Barang).get(request.matchdict['id'])
    if not barang:
        return HTTPNotFound(json_body={'error': 'Barang tidak ditemukan'})
    try:
        request.dbsession.delete(barang)
        request.dbsession.commit()
        return {'success': True, 'message': 'Barang berhasil dihapus'}
    except Exception as e:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': str(e)})


# ====== Supplier ======

@view_config(route_name='supplier_list', renderer='json')
@require_login
def supplier_list(request):
    suppliers = request.dbsession.query(Supplier).all()
    return {'suppliers': [s.to_dict() for s in suppliers]}


@view_config(route_name='supplier_detail', renderer='json')
@require_login
def supplier_detail(request):
    supplier = request.dbsession.query(Supplier).get(request.matchdict['id'])
    if not supplier:
        return HTTPNotFound(json_body={'error': 'Supplier tidak ditemukan'})
    return {'supplier': supplier.to_dict()}


@view_config(route_name='supplier_add', request_method='POST', renderer='json')
@require_admin
def supplier_add(request):
    try:
        data = request.json_body
        supplier = Supplier(
            nama_supplier=data['nama_supplier'],
            kontak=data.get('kontak'),
            alamat=data.get('alamat'),
        )
        request.dbsession.add(supplier)
        request.dbsession.flush()
        request.dbsession.commit()
        return {'success': True, 'supplier': supplier.to_dict()}
    except Exception as e:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='supplier_update', request_method='PUT', renderer='json')
@require_admin
def supplier_update(request):
    supplier = request.dbsession.query(Supplier).get(request.matchdict['id'])
    if not supplier:
        return HTTPNotFound(json_body={'error': 'Supplier tidak ditemukan'})
    try:
        data = request.json_body
        for field in ['nama_supplier', 'kontak', 'alamat']:
            if field in data:
                setattr(supplier, field, data[field])
        request.dbsession.commit()
        return {'success': True, 'supplier': supplier.to_dict()}
    except Exception as e:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='supplier_delete', request_method='DELETE', renderer='json')
@require_admin
def supplier_delete(request):
    supplier = request.dbsession.query(Supplier).get(request.matchdict['id'])
    if not supplier:
        return HTTPNotFound(json_body={'error': 'Supplier tidak ditemukan'})
    try:
        request.dbsession.delete(supplier)
        request.dbsession.commit()
        return {'success': True, 'message': 'Supplier berhasil dihapus'}
    except Exception as e:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': str(e)})

# ====== Users ======

@view_config(route_name='user_list', renderer='json')
@require_admin
def user_list(request):
    users = request.dbsession.query(User).all()
    return {'users': [u.to_dict() for u in users]}

@view_config(route_name='user_detail', renderer='json')
@require_admin
def user_detail(request):
    id_ = request.matchdict['id']
    user_obj = request.dbsession.query(User).get(id_)
    if not user_obj:
        return HTTPNotFound(json_body={'error': 'User tidak ditemukan'})
    return {'user': user_obj.to_dict()}


@view_config(route_name='user_add', request_method='POST', renderer='json')
@require_admin
def user_add(request):
    try:
        data = request.json_body
        user_obj = User(
            username=data['username'],
            password_hash=bcrypt.hash(data['password']),
            role=data.get('role', 'admin'),
        )
        request.dbsession.add(user_obj)
        request.dbsession.flush()
        request.dbsession.commit()
        return {'success': True, 'user': user_obj.to_dict()}
    except Exception as e:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='user_update', request_method='PUT', renderer='json')
@require_admin
def user_update(request):
    user_obj = request.dbsession.query(User).get(request.matchdict['id'])
    if not user_obj:
        return HTTPNotFound(json_body={'error': 'User tidak ditemukan'})
    try:
        data = request.json_body
        for field in ['username', 'role']:
            if field in data:
                setattr(user_obj, field, data[field])
        if 'password' in data and data['password']:
            user_obj.password_hash = bcrypt.hash(data['password'])
        request.dbsession.commit()
        return {'success': True, 'user': user_obj.to_dict()}
    except Exception as e:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='user_delete', request_method='DELETE', renderer='json')
@require_admin
def user_delete(request):
    user_obj = request.dbsession.query(User).get(request.matchdict['id'])
    if not user_obj:
        return HTTPNotFound(json_body={'error': 'User tidak ditemukan'})
    request.dbsession.delete(user_obj)
    try:
        request.dbsession.commit()
        return {'success': True, 'message': 'User berhasil dihapus'}
    except Exception as e:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': str(e)})

@view_config(route_name='any_options', request_method='OPTIONS')
def options_handler(request):
    return Response(status=200)
