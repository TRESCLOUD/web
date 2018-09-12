# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    "name": "Trescloud Web Responsive",
    "summary": "Prevent to search modules from 'Aplication' menu",
    "version": "10.0.1.2.2",
    "category": "Website",
    "website": "http://www.trescloud.com",
    "author": "TRESCLOUD CIA LTDA",
    "license": "LGPL-3",
    "installable": True,
    "depends": [
        'web',
        'web_responsive'
    ],
    "data": [
        'views/assets.xml',
        'views/web.xml',
    ],
    'qweb': [],
}
