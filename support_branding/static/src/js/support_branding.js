
odoo.define('support_branding.CrashManager', function (require) {
    "use strict";

    var $ = require('jquery');
    var core = require('web.core');
    var _t = core._t;
    var _lt = core._lt;
    var QWeb = core.qweb;
    var CrashManager = require('web.CrashManager');
    var Model = require('web.Model');
    
    CrashManager.include({

        show_error: function(error)
        {
            var self = this;
            error['session'] = odoo.session_info;
            this._super(error);
            var ir_config_parameter = new Model('ir.config_parameter');
            ir_config_parameter.call('get_param', ['support_branding.support_email']).then(
                function(email)
                {
                    self.support_branding_support_email = email;

                    ir_config_parameter.call('get_param', ['support_branding.company_name']).then(
                        function(name)
                        {
                            self.support_branding_company_name = name;
                            $('.support-branding-submit-form').each(function()
                            {
                                var $form = $(this),
                                    $button = $form.find('button'),
                                    $description = $form.find('textarea[name="description"]'),
                                    $subject = $form.find('input[name="subject"]'),
                                    $body = $form.find('input[name="body"]');
                                if(self.support_branding_support_email)
                                {
                                    $form.attr(
                                        'action',
                                        'mailto:' + self.support_branding_support_email);
                                    $form.parents('.modal').find('.modal-body')
                                        .css('max-height', '70vh');
                                    $button.click(function(ev)
                                    {
                                        var mail_mail = new Model('mail.mail');
                                        if(!$description.val())
                                        {
                                            $description.parent().addClass('oe_form_invalid');
                                            ev.preventDefault();
                                            return;
                                        }
                                        mail_mail.call(
                                            'create',
                                            [{
                                                state: 'outgoing',
                                                auto_delete: false,
                                                email_to: self.support_branding_support_email,
                                                subject: $subject.val(),
                                                body_html: $('<div/>').append(
                                                    $('<div/>').text($description.val()),
                                                    $('<pre/>').text($body.val())
                                                ).html(),
                                            }])
                                        .then(function(mail_id)
                                        {
                                            return mail_mail.call('send', [[mail_id]]);
                                        }, function()
                                        {
                                            // if the call failed, fire the mailto link
                                            // hoping there is a properly configured email
                                            // client
                                            $body.val($description.val() + '\n' + $body.val())
                                            $button.unbind('click');
                                            $button.click();
                                        })
                                        .then(function()
                                        {
                                            $form.parents('.modal').modal('hide');
                                        });
                                        ev.preventDefault();
                                    });
                                }
                                else
                                {
                                    $description.hide();
                                    $button.hide();
                                }
                                if(self.support_branding_company_name)
                                {
                                    $button.text(
                                        _.str.sprintf(
                                            openerp.web._t('Email to %s'),
                                            self.support_branding_company_name));
                                }
                                $form.prependTo(
                                    $form.parents('.modal-dialog').find('.modal-footer'));
                            });
                        }
                    );
                }
             );
        }
    });
});
