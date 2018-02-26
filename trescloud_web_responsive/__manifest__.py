# -*- coding: utf-8 -*-
# Copyright 2016-2017 LasLabs Inc.
# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl.html).

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
