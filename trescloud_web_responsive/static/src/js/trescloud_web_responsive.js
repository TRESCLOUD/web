/* Copyright 2016 LasLabs Inc.
 * License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl). */

odoo.define('trescloud_web_responsive', function(require) {
    'use strict';

    var web_responsive = require('web_responsive')

    var AppDrawer = web_responsive.AppDrawer.include({
        handleKeyDown: function(e) {
            return;
        },

        redirectKeyPresses: function(e) {
            return;
        },
    });

});
