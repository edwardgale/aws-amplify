'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _awsAmplify = require('aws-amplify');

var _AmplifyTheme = require('../AmplifyTheme');

var _AmplifyTheme2 = _interopRequireDefault(_AmplifyTheme);

var _AmplifyUI = require('../AmplifyUI');

var _qrcode = require('qrcode.react');

var _qrcode2 = _interopRequireDefault(_qrcode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the License. A copy of the License is located at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *     http://aws.amazon.com/apache2.0/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * and limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var logger = new _awsAmplify.Logger('MFASetupComp');

var MFASetupComp = function (_Component) {
    _inherits(MFASetupComp, _Component);

    function MFASetupComp(props) {
        _classCallCheck(this, MFASetupComp);

        var _this = _possibleConstructorReturn(this, (MFASetupComp.__proto__ || Object.getPrototypeOf(MFASetupComp)).call(this, props));

        _this.setup = _this.setup.bind(_this);
        _this.showSecretCode = _this.showSecretCode.bind(_this);
        _this.verifyTotpToken = _this.verifyTotpToken.bind(_this);
        _this.handleInputChange = _this.handleInputChange.bind(_this);

        _this.state = {
            code: null,
            setupMessage: null
        };
        return _this;
    }

    _createClass(MFASetupComp, [{
        key: 'handleInputChange',
        value: function () {
            function handleInputChange(evt) {
                this.setState({ setupMessage: null });
                this.inputs = {};
                var _evt$target = evt.target,
                    name = _evt$target.name,
                    value = _evt$target.value,
                    type = _evt$target.type,
                    checked = _evt$target.checked;

                var check_type = ['radio', 'checkbox'].includes(type);
                this.inputs[name] = check_type ? checked : value;
            }

            return handleInputChange;
        }()
    }, {
        key: 'setup',
        value: function () {
            function setup() {
                var _this2 = this;

                this.setState({ setupMessage: null });
                var user = this.props.authData;
                _awsAmplify.Auth.setupTOTP(user).then(function (data) {
                    logger.debug('secret key', data);
                    var code = "otpauth://totp/AWSCognito:" + user.username + "?secret=" + data + "&issuer=AWSCognito";
                    _this2.setState({ code: code });
                })['catch'](function (err) {
                    return logger.debug('mfa setup failed', err);
                });
            }

            return setup;
        }()
    }, {
        key: 'verifyTotpToken',
        value: function () {
            function verifyTotpToken() {
                var _this3 = this;

                var user = this.props.authData;
                var totpCode = this.inputs.totpCode;

                _awsAmplify.Auth.verifyTotpToken(user, totpCode).then(function () {
                    // set it to prefered mfa
                    _awsAmplify.Auth.setPreferedMFA(user, 'TOTP');
                    _this3.setState({ setupMessage: 'Setup TOTP successfully!' });
                    logger.debug('set up totp success!');
                })['catch'](function (err) {
                    _this3.setState({ setupMessage: 'Setup TOTP failed!' });
                    logger.error(err);
                });
            }

            return verifyTotpToken;
        }()
    }, {
        key: 'showSecretCode',
        value: function () {
            function showSecretCode(code, theme) {
                if (!code) return null;
                return _react2['default'].createElement(
                    'div',
                    null,
                    _react2['default'].createElement(_qrcode2['default'], { value: code }),
                    _react2['default'].createElement(_AmplifyUI.InputRow, {
                        autoFocus: true,
                        placeholder: _awsAmplify.I18n.get('totp verification token'),
                        theme: theme,
                        key: 'totpCode',
                        name: 'totpCode',
                        onChange: this.handleInputChange
                    }),
                    _react2['default'].createElement(
                        _AmplifyUI.ButtonRow,
                        { theme: theme, onClick: this.verifyTotpToken },
                        _awsAmplify.I18n.get('Verify')
                    )
                );
            }

            return showSecretCode;
        }()
    }, {
        key: 'render',
        value: function () {
            function render() {
                var theme = this.props.theme ? this.props.theme : _AmplifyTheme2['default'];
                var code = this.state.code;

                return _react2['default'].createElement(
                    _AmplifyUI.FormSection,
                    { theme: theme },
                    _react2['default'].createElement(
                        _AmplifyUI.SectionHeader,
                        { theme: theme },
                        _awsAmplify.I18n.get('MFA Setup')
                    ),
                    _react2['default'].createElement(
                        _AmplifyUI.SectionBody,
                        { theme: theme },
                        _react2['default'].createElement(
                            _AmplifyUI.ButtonRow,
                            { theme: theme, onClick: this.setup },
                            _awsAmplify.I18n.get('Get secret key')
                        ),
                        this.showSecretCode(code, theme),
                        this.state.setupMessage ? _react2['default'].createElement(
                            _AmplifyUI.MessageRow,
                            { theme: theme },
                            _awsAmplify.I18n.get(this.state.setupMessage)
                        ) : null
                    )
                );
            }

            return render;
        }()
    }]);

    return MFASetupComp;
}(_react.Component);

exports['default'] = MFASetupComp;