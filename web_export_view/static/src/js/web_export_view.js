odoo.define('web_export_view', function (require) {
"use strict";

    var core = require('web.core');
    var Sidebar = require('web.Sidebar');
    var QWeb = core.qweb;
    // INICIO DEL CODIGO ADICIONADO POR TRESCLOUD
    var ajax = require('web.ajax');
    var Dialog = require('web.Dialog');
    // FIN DEL CODIGO ADICIONADO POR TRESCLOUD

    var _t = core._t;

    Sidebar.include({

        redraw: function () {
            var self = this;
            this._super.apply(this, arguments);
            if (self.getParent().ViewManager.active_view.type == 'list') {
                self.$el.find('.o_dropdown').last().append(QWeb.render('WebExportTreeViewXls', {widget: self}));
                // INICIO DEL CODIGO MODIFICADO POR TRESCLOUD
                self.$el.find('.export_treeview_xls').on('click', function(){
                    self.custom_on_sidebar_export_treeview_xls();
                });
                // FIN DEL CODIGO MODIFICADO POR TRESCLOUD
            }
        },
        // INICIO DEL CODIGO ADICIONADO POR TRESCLOUD
        /*
        * Funcion que comprueba si el usuario logueado pertenece al grupo de
        * seguridad "ecua_dependence_helper.web_export_view_export_group".
        * IF prtenece simulamos un click al boton original que esta
        * display:none, else mostramos dialogo de error.
        */
        custom_on_sidebar_export_treeview_xls: function () {
            var self = this;
            ajax.jsonRpc('/web/check/web_export_view/visibility', 'call', {
            }).then(function (web_export_view_export_group) {
                if(web_export_view_export_group){
                    self.on_sidebar_export_treeview_xls();
                }
                else{
                    Dialog.alert(self, 'Solo los usuarios que pertenecen al grupo "Derechos de exportación de vistas lista", pueden realizar esta operación.', {
                        title: 'Advertencia',
                    });
                }
            });
        },
        // FIN DEL CODIGO ADICIONADO POR TRESCLOUD

        on_sidebar_export_treeview_xls: function () {
            // Select the first list of the current (form) view
            // or assume the main view is a list view and use that
            var self = this,
                view = this.getParent(),
                children = view.getChildren();
            if (children) {
                children.every(function (child) {
                    if (child.field && child.field.type == 'one2many') {
                        view = child.viewmanager.views.list.controller;
                        return false; // break out of the loop
                    }
                    if (child.field && child.field.type == 'many2many') {
                        view = child.list_view;
                        return false; // break out of the loop
                    }
                    return true;
                });
            }
            var export_columns_keys = [];
            var export_columns_names = [];
            $.each(view.visible_columns, function () {
                if (this.tag == 'field' && (this.widget === undefined || this.widget != 'handle')) {
                    // non-fields like `_group` or buttons
                    export_columns_keys.push(this.id);
                    export_columns_names.push(this.string);
                }
            });
            var export_rows = [];
            $.blockUI();
            if (children) {
                // find only rows with data
                view.$el.find('.o_list_view > tbody > tr[data-id]:has(.o_list_record_selector input:checkbox:checked)')
                .each(function () {
                    var $row = $(this);
                    var export_row = [];
                    $.each(export_columns_keys, function () {
                        var $cell = $row.find('td[data-field="' + this + '"]')
                        var $cellcheckbox = $cell.find('.o_checkbox input:checkbox');
                        if ($cellcheckbox.length) {
                            export_row.push(
                                $cellcheckbox.is(":checked")
                                ? _t("True") : _t("False")
                            );
                        }
                        else {
                            var text = $cell.text().trim();
                            if ($cell.hasClass("o_list_number")) {
                                export_row.push(parseFloat(
                                    text
                                    // Remove thousands separator
                                    .split(_t.database.parameters.thousands_sep)
                                    .join("")
                                    // Always use a `.` as decimal separator
                                    .replace(_t.database.parameters.decimal_point, ".")
                                    // Remove non-numeric characters
                                    .replace(/[^\d\.-]/g, "")
                                ));
                            }
                            else {
                                export_row.push(text);
                            }
                        }
                    });
                    export_rows.push(export_row);
                });
            }
            view.session.get_file({
                url: '/web/export/xls_view',
                data: {data: JSON.stringify({
                    model: view.model,
                    headers: export_columns_names,
                    rows: export_rows
                })},
                complete: $.unblockUI
            });
        }

    });
});
