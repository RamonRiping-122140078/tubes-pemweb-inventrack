def includeme(config):
    config.add_route('home', '/')
    config.add_route('me', '/api/me')

    # Login route
    config.add_route('login', '/api/login', request_method='POST')

    # Barang
    config.add_route('barang_list', '/api/barang', request_method='GET')
    config.add_route('barang_detail', '/api/barang/{id}', request_method='GET')
    config.add_route('barang_add', '/api/barang', request_method='POST')
    config.add_route('barang_update', '/api/barang/{id}', request_method='PUT')
    config.add_route('barang_delete', '/api/barang/{id}', request_method='DELETE')

    # Supplier
    config.add_route('supplier_list', '/api/supplier', request_method='GET')
    config.add_route('supplier_detail', '/api/supplier/{id}', request_method='GET')
    config.add_route('supplier_add', '/api/supplier', request_method='POST')
    config.add_route('supplier_update', '/api/supplier/{id}', request_method='PUT')
    config.add_route('supplier_delete', '/api/supplier/{id}', request_method='DELETE')

    # Users
    config.add_route('user_list', '/api/users', request_method='GET')
    config.add_route('user_detail', '/api/users/{id}', request_method='GET')
    config.add_route('user_add', '/api/users', request_method='POST')
    config.add_route('user_update', '/api/users/{id}', request_method='PUT')
    config.add_route('user_delete', '/api/users/{id}', request_method='DELETE')
