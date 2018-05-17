/* Part of Odoo. See LICENSE file for full copyright and licensing details. */

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
