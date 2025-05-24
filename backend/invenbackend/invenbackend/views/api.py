from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from ..models import Barang, Supplier, User
import datetime


# ====== Barang ======
@view_config(route_name='barang_list', renderer='json')
def barang_list(request):
    barangs = request.dbsession.query(Barang).all()
    return {'barangs': [b.to_dict() for b in barangs]}


@view_config(route_name='barang_detail', renderer='json')
def barang_detail(request):
    barang = request.dbsession.query(Barang).get(request.matchdict['id'])
    if not barang:
        return HTTPNotFound(json_body={'error': 'Barang tidak ditemukan'})
    return {'barang': barang.to_dict()}


@view_config(route_name='barang_add', request_method='POST', renderer='json')
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
        return {'success': True, 'barang': barang.to_dict()}
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='barang_update', request_method='PUT', renderer='json')
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
        return {'success': True, 'barang': barang.to_dict()}
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='barang_delete', request_method='DELETE', renderer='json')
def barang_delete(request):
    barang = request.dbsession.query(Barang).get(request.matchdict['id'])
    if not barang:
        return HTTPNotFound(json_body={'error': 'Barang tidak ditemukan'})
    request.dbsession.delete(barang)
    return {'success': True, 'message': 'Barang berhasil dihapus'}


# ====== Supplier ======
@view_config(route_name='supplier_list', renderer='json')
def supplier_list(request):
    suppliers = request.dbsession.query(Supplier).all()
    return {'suppliers': [s.to_dict() for s in suppliers]}


@view_config(route_name='supplier_detail', renderer='json')
def supplier_detail(request):
    supplier = request.dbsession.query(Supplier).get(request.matchdict['id'])
    if not supplier:
        return HTTPNotFound(json_body={'error': 'Supplier tidak ditemukan'})
    return {'supplier': supplier.to_dict()}


@view_config(route_name='supplier_add', request_method='POST', renderer='json')
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
        return {'success': True, 'supplier': supplier.to_dict()}
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='supplier_update', request_method='PUT', renderer='json')
def supplier_update(request):
    supplier = request.dbsession.query(Supplier).get(request.matchdict['id'])
    if not supplier:
        return HTTPNotFound(json_body={'error': 'Supplier tidak ditemukan'})
    try:
        data = request.json_body
        for field in ['nama_supplier', 'kontak', 'alamat']:
            if field in data:
                setattr(supplier, field, data[field])
        return {'success': True, 'supplier': supplier.to_dict()}
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='supplier_delete', request_method='DELETE', renderer='json')
def supplier_delete(request):
    supplier = request.dbsession.query(Supplier).get(request.matchdict['id'])
    if not supplier:
        return HTTPNotFound(json_body={'error': 'Supplier tidak ditemukan'})
    request.dbsession.delete(supplier)
    return {'success': True, 'message': 'Supplier berhasil dihapus'}


# ====== Users ======
@view_config(route_name='user_list', renderer='json')
def user_list(request):
    users = request.dbsession.query(User).all()
    return {'users': [u.to_dict() for u in users]}


@view_config(route_name='user_detail', renderer='json')
def user_detail(request):
    user = request.dbsession.query(User).get(request.matchdict['id'])
    if not user:
        return HTTPNotFound(json_body={'error': 'User tidak ditemukan'})
    return {'user': user.to_dict()}


@view_config(route_name='user_add', request_method='POST', renderer='json')
def user_add(request):
    try:
        data = request.json_body
        user = User(
            username=data['username'],
            password_hash=data['password_hash'],  # Ideally hash password beforehand
            role=data.get('role', 'admin'),
        )
        request.dbsession.add(user)
        request.dbsession.flush()
        return {'success': True, 'user': user.to_dict()}
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='user_update', request_method='PUT', renderer='json')
def user_update(request):
    user = request.dbsession.query(User).get(request.matchdict['id'])
    if not user:
        return HTTPNotFound(json_body={'error': 'User tidak ditemukan'})
    try:
        data = request.json_body
        for field in ['username', 'password_hash', 'role']:
            if field in data:
                setattr(user, field, data[field])
        return {'success': True, 'user': user.to_dict()}
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='user_delete', request_method='DELETE', renderer='json')
def user_delete(request):
    user = request.dbsession.query(User).get(request.matchdict['id'])
    if not user:
        return HTTPNotFound(json_body={'error': 'User tidak ditemukan'})
    request.dbsession.delete(user)
    return {'success': True, 'message': 'User berhasil dihapus'}
