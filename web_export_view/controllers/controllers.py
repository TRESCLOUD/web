# -*- coding: utf-8 -*-
# Copyright 2016 Henry Zhou (http://www.maxodoo.com)
# Copyright 2016 Rodney (http://clearcorp.cr/)
# Copyright 2012 Agile Business Group
# Copyright 2012 Therp BV
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

import json
import odoo.http as http
from odoo.http import request
from odoo.addons.web.controllers.main import ExcelExport
# INICIO DEL CODIGO AGREGADO POR TRESCLOUD
from odoo.exceptions import AccessDenied
# FIN DEL CODIGO AGREGADO POR TRESCLOUD


class ExcelExportView(ExcelExport):
    def __getattribute__(self, name):
        if name == 'fmt':
            raise AttributeError()
        return super(ExcelExportView, self).__getattribute__(name)

    @http.route('/web/export/xls_view', type='http', auth='user')
    def export_xls_view(self, data, token):
        # INICIO DEL CODIGO AGREGADO POR TRESCLOUD
        # Se asegura que por ninguna via se pueda generar contenido
        # por usuarios que no pertenezcan al grupo de seguridad
        # 'ecua_dependence_helper.web_export_view_export_group'
        if not self.check_group_visibility():
            raise AccessDenied()
        # FIN DEL CODIGO AGREGADO POR TRESCLOUD
        data = json.loads(data)
        model = data.get('model', [])
        columns_headers = data.get('headers', [])
        rows = data.get('rows', [])

        return request.make_response(
            self.from_data(columns_headers, rows),
            headers=[
                ('Content-Disposition', 'attachment; filename="%s"'
                 % self.filename(model)),
                ('Content-Type', self.content_type)
            ],
            cookies={'fileToken': token}
        )

    # INICIO DEL CODIGO AGREGADO POR TRESCLOUD
    @http.route('/web/check/web_export_view/visibility', type='json',
                auth='user')
    def check_group_visibility(self):
        """
        Comprueba si el usuario logueado pertenece al grupo de seguridad
        para exportar la vista lista. Se usa desde js(web_export_view.js)
        """
        return request.env.user.has_group(
            'ecua_dependence_helper.web_export_view_export_group'
        )
    # FIN DEL CODIGO AGREGADO POR TRESCLOUD
