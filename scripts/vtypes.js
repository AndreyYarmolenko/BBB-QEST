Ext.define('Override.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',
    mmValid: function(value) {
        var valid = true;
        if((value.match(/\./g) !=null)&&(value.match(/\./g).length>1)) valid = false;
        return (this.mmValidRe.test(value)&&valid);
    },
    mmValidRe: /^\d+(\.\d+)*$/,
    mmValidText: lan.incor_format,
    mmValidMask: /[0-9\.\,]/
});

Ext.define('Override.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',
    inchValid: function(value) {
        var valid = true;
        if((value.match(/\./g) !=null)&&(value.match(/\./g).length>1)) valid = false;
        return (this.inchValidRe.test(value)&&valid);
    },
    inchValidRe: /^\d+(\.\d+)*$|^\d*\s?\"?(\d+\/\d+)?"?$/,
    inchValidText: lan.incor_format,
    inchValidMask: /[0-9\ \"\/\.\,]/
});

Ext.define('Override.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',
    threadValid: function(value) {
        return this.threadValidRe.test(value);
    },
    threadValidRe: /\w\.?/,
    threadValidText: lan.incor_format,
    //threadValidMask: /[0-9a-zA-Z\ \.]/
    threadValidMask: /[0-9M\ \x\-\"\/\.\,]/
});

Ext.define('Override.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',
    idValid: function(value) {
        return this.idValidRe.test(value);
    },
    idValidRe: /^\w+\-?\/?\w+$/,
    idValidText: lan.incor_format,
    idValidMask: /[0-9a-zA-Z\-\/]/
});

Ext.define('Override.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',
    nameValid: function(value) {
        return this.nameValidRe.test(value);
    },
    nameValidRe: /^[^\s]\w+/,
    nameValidText: lan.incor_format,
});

var regexDecimal = /^\d+(\.\d+)*$/;
var regexYear = /^\d{4}$/;

Ext.define('Override.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',
    degValid: function(value) {
        return (this.degValidRe.test(value));
    },
    degValidRe: /[0-9]+/,
    degValidText: lan.incor_format,
    degValidMask: /[0-9]/
});

Ext.define('Override.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',
    turnValid: function(value) {
        var valid = true;
        if((value.match(/\./g) !=null)&&(value.match(/\./g).length>1)) valid = false;
        return (this.turnValidRe.test(value)&&valid);
    },
    turnValidRe: /^\d+(\.\d+)*$|^\d*\s?(\d+\/\d+)?$/,
    turnValidText: lan.incor_format,
    turnValidMask: /[0-9\ \/\.\,]/
});

Ext.define('Override.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',
    intValid: function(value) {
        return this.intValidRe.test(value);
    },
    intValidRe: /^\d+$/,
    intValidText: lan.incor_format,
    intValidMask: /[0-9]/
});