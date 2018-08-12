$(function(){

    // setup all the urls
    var url = location.protocol + '//' + location.host + location.pathname;
    $('.replaceurl').each(function(i, e){
        var $element = $(e);
        var $value = $element.val().replace('${}', url);
        $element.val($value);
    });

    // syntax highlighting
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    //
    // EXAMPLES
    //

    var jsonExamples = {
        "Decimal Integer": {"kind":"OMI","decimal":"-120"}, 
        "Hexadecimal Float": {"kind":"OMF","float":1e-10},
    
        "Variable X": {"kind":"OMV","name":"x"},
    
        "Sin Symbol": {"kind":"OMS","cdbase":"http://www.openmath.org/cd","cd":"transc1","name":"sin"},
    
        "String": {"kind":"OMSTR","string":"Hello world"},
    
        "Byte Array": {"kind":"OMB","bytes":[104,101,108,108,111,32,119,111,114,108,100]},
        "Byte Array in Base64": {"kind":"OMB","base64":"aGVsbG8gd29ybGQ="},
    
        "Application": {"kind":"OMA","applicant":{"kind":"OMS","cd":"transc1","name":"sin"},"arguments":[{"kind":"OMV","name":"x"}]},
    
        "Binding": {"kind":"OMBIND","binder":{"kind":"OMS","cd":"fns1","name":"lambda"},"variables":[{"kind":"OMV","name":"x"}],"object":{"kind":"OMA","applicant":{"kind":"OMS","cd":"transc1","name":"sin"},"arguments":[{"kind":"OMV","name":"x"}]}},
    
        "Simple Attribution": {"kind":"OMATTR","attributes":[[{"kind":"OMS","cd":"ecc","name":"type"},{"kind":"OMS","cd":"ecc","name":"real"}]],"object":{"kind":"OMV","name":"x"}},
        "Complex Attribution": {"kind":"OMATTR","attributes":[[{"kind":"OMS","cd":"annotations1","name":"presentation-form"},{"kind":"OMFOREIGN","encoding":"text/x-latex","foreign":"\\sin(x)"}]],"object":{"kind":"OMA","applicant":{"kind":"OMS","cd":"transc1","name":"sin"},"arguments":[{"kind":"OMV","name":"x"}]}},
    
        "Error": {"kind":"OME","error":{"kind":"OMS","cd":"aritherror","name":"DivisionByZero"},"arguments":[{"kind":"OMA","applicant":{"kind":"OMS","cd":"arith1","name":"divide"},"arguments":[{"kind":"OMV","name":"x"},{"kind":"OMI","integer":0}]}]},
    
        "Wrapped Object": {"kind":"OMOBJ","openmath":"2.0","object":{"kind":"OMSTR","string":"Hello world"}},
    
        "Object with References": {"kind":"OMOBJ","object":{"kind":"OMA","applicant":{"kind":"OMV","name":"f"},"arguments":[{"kind":"OMA","id":"t1","applicant":{"kind":"OMV","name":"f"},"arguments":[{"kind":"OMA","id":"t11","applicant":{"kind":"OMV","name":"f"},"arguments":[{"kind":"OMV","name":"a"},{"kind":"OMV","name":"a"}]},{"kind":"OMR","href":"#t11"}]},{"kind":"OMR","href":"#t1"}]}}
    };

    for(var key in jsonExamples){ jsonExamples[key] = p(jsonExamples[key]); }
    

    var xmlExamples = {
        "Decimal Integer": '<OMI xmlns="http://www.openmath.org/OpenMath">-120</OMI>', 
        "Hexadecimal Float": '<OMF xmlns="http://www.openmath.org/OpenMath" dec="1e-10"/>',
    
        "Variable X": '<OMV xmlns="http://www.openmath.org/OpenMath" name="x"/>',
    
        "Sin Symbol": '<OMS xmlns="http://www.openmath.org/OpenMath" cdbase="http://www.openmath.org/cd" cd="transc1" name="sin"/>',
    
        "String": '<OMSTR xmlns="http://www.openmath.org/OpenMath">Hello world</OMSTR>',
    
        "Byte Array": '<OMB xmlns="http://www.openmath.org/OpenMath">aGVsbG8gd29ybGQ=</OMB>',
    
        "Application": '<OMA xmlns="http://www.openmath.org/OpenMath"><OMS cd="transc1" name="sin"/><OMV name="x"/></OMA>',
    
        "Binding": '<OMBIND xmlns="http://www.openmath.org/OpenMath"><OMS cd="fns1" name="lambda"/><OMBVAR><OMV name="x"/></OMBVAR><OMA><OMS cd="transc1" name="sin"/><OMV name="x"/></OMA></OMBIND>',
    
        "Simple Attribution": '<OMATTR xmlns="http://www.openmath.org/OpenMath"><OMATP><OMS cd="ecc" name="type"/><OMS cd="ecc" name="real"/></OMATP><OMV name="x"/></OMATTR>',
        "Complex Attribution": '<OMATTR xmlns="http://www.openmath.org/OpenMath"><OMATP><OMS cd="annotations1" name="presentation-form"/><OMFOREIGN encoding="text/x-latex">\\sin(x)</OMFOREIGN></OMATP><OMA><OMS cd="transc1" name="sin"/><OMV name="x"/></OMA></OMATTR>',

        "Error": '<OME xmlns="http://www.openmath.org/OpenMath"><OMS cd="aritherror" name="DivisionByZero"/><OMA><OMS cd="arith1" name="divide"/><OMV name="x"/><OMI>0</OMI></OMA></OME>',

        "Wrapped Object": '<OMOBJ xmlns="http://www.openmath.org/OpenMath"><OMSTR>Hello world</OMSTR></OMOBJ>',
    
        "Object with References": '<OMOBJ xmlns="http://www.openmath.org/OpenMath"><OMA><OMV name="f"/><OMA id="t1"><OMV name="f"/><OMA id="t11"><OMV name="f"/><OMV name="a"/><OMV name="a"/></OMA><OMR href="#t11"/></OMA><OMR href="#t1"/></OMA></OMOBJ>'
    };
    for(var key in xmlExamples){ xmlExamples[key] = q(xmlExamples[key]); }

    var knownTypes = [
        'omany', 
        'OMOBJ',
        'omel',
        'OMS',
        'OMV',
        'OMI',
        'OMF',
        'OMB',
        'OMSTR',
        'OMA',
        'OMATTR',
        'OMBIND',
        'attvar',
        'OME',
        'OMFOREIGN',
        'OMR'
    ];

    //
    // VALIDATE
    //

    var 
        $validateBtn = $('#validateBtn')
        $validateProp = $('#validateProp'),
        $validateTypes = $('#validateTypes'),
        $validateInput = $('#validateInput'),
        $validateResult = $('#validateResult'),
        $validateMessage = $('#validateMessage'),
        $validateExampleBtn = $('#validateExampleBtn'),
        $validateExampleSelect = $('#validateExampleSelect');
    
    // add known kinds
    for(var i = 0; i < knownTypes.length; i++){
        $validateProp.append(
            $('<option>')
            .val(knownTypes[i])
            .text(knownTypes[i])
        );
        $validateTypes.append(
            $('<span class="badge badge-primary">')
            .text(knownTypes[i]), 
            ' '
        );
    }



    
    createAPIDemo(
        function() /* endpoint */ {
            return 'api/v1/validate?kind=' + $validateProp.val(); 
        },
        function(res) /* isSuccess */ {
            return res.success && res.result.valid;
        },
        function() /* getSuccessMessage */{
            return 'Valid OpenMath-JSON ' + $validateProp.val() + ' element';
        },
        function(res) /* getErrorMessage */{
            return res.success ? res.result.errors[res.result.errors.length - 1].stack : res.message;
        },
        function(res, success) /* getOutput */{
            if(success){
                return 'Valid. ';
            } else if(res.success){
                var errors = res.result.errors;
                errors.reverse();
                return errors
                    .map(function(v){return v.stack; })
                    .join('\n');
            } else {
                return res.message;
            }
        },
        function(res) /* formatOutput */ { return res; },
        $validateBtn, $validateInput, $validateResult, $validateMessage,
        $validateExampleBtn, $validateExampleSelect, jsonExamples
    );

    //
    // XML => JSON
    //

    var 
        $convertJSONBtn = $('#convertJSONBtn')
        $convertJSONInput = $('#convertJSONInput'),
        $convertJSONResult = $('#convertJSONResult'),
        $convertJSONMessage = $('#convertJSONMessage'),
        $convertJSONExampleBtn = $('#convertJSONExampleBtn'),
        $convertJSONExampleSelect = $('#convertJSONExampleSelect');
    
    
    createAPIDemo(
        'api/v1/convert/json' /* endpoint */,
        function(res) /* isSuccess */ { return res.success; },
        'Converted successfully' /* getSuccessMessage */ ,
        function(res) /* getErrorMessage */ { return res.message; },
        function(res, success) /* getOutput */ { return res.success ? res.result : null; },
        p /* formatOutput */,
        $convertJSONBtn, $convertJSONInput, $convertJSONResult, $convertJSONMessage,
        $convertJSONExampleBtn, $convertJSONExampleSelect, xmlExamples
    );

    //
    // JSON => XML
    //

    var 
        $convertXMLBtn = $('#convertXMLBtn')
        $convertXMLInput = $('#convertXMLInput'),
        $convertXMLResult = $('#convertXMLResult'),
        $convertXMLMessage = $('#convertXMLMessage'),
        $convertXMLExampleBtn = $('#convertXMLExampleBtn'),
        $convertXMLExampleSelect = $('#convertXMLExampleSelect');
    
    
    createAPIDemo(
        'api/v1/convert/xml' /* endpoint */,
        function(res) /* isSuccess */ { return res.success; },
        'Converted successfully' /* getSuccessMessage */ ,
        function(res) /* getErrorMessage */ { return res.message; },
        function(res, success) /* getOutput */ { return res.success ? res.result : null; },
        q /* formatOutput */,
        $convertXMLBtn, $convertXMLInput, $convertXMLResult, $convertXMLMessage,
        $convertXMLExampleBtn, $convertXMLExampleSelect, jsonExamples
    );

    function p(json){ return vkbeautify.json(json, 4); }
    function q(xml){ return vkbeautify.xml(xml, 4); }


    //
    // HELPER FUNCTION
    //

    function createAPIDemo(
        endpoint, 
        isSuccess,  getSuccessMessage, getErrorMessage, 
        getOutput, formatOutput, 
        $button, $input, $output, $message,
        $exampleButton, $exampleSelect, examples
    ) {
        $button.click(function(e){
            e.preventDefault();

            var theEndpoint = endpoint;
            if(typeof endpoint === 'function'){
                theEndpoint = endpoint();
            }

            var theSuccessMessage = getSuccessMessage;
            if(typeof getSuccessMessage === 'function'){
                theSuccessMessage = getSuccessMessage();
            }
            
            $.ajax(theEndpoint, {
                'data': $input.val(),
                'type': 'POST', 
                'processData': false,
                'contentType': 'text/plain'
            }).done(function(res){
                var $alert = $('<div class="alert" role="alert">')

                var success = isSuccess(res);
                if(success){
                    $output.removeClass('is-invalid').addClass('is-valid');
                    $alert
                        .addClass('alert-success')
                        .text(theSuccessMessage);
                } else {
                    $output.removeClass('is-valid').addClass('is-invalid');

                    $alert
                        .addClass('alert-danger')
                        .text(getErrorMessage(res));
                }

                $message.empty().append($alert);
                
                var theOutput = getOutput(res, success);
                $output.val(theOutput ? formatOutput(theOutput) : '');
            });
        });
        
        if(typeof $exampleButton !== 'undefined'){
            $exampleButton.click(function(){
                $input.val($exampleSelect.val());
                $button.click();
            });

            $.each(examples, function(key, value) {
                $('<option>').val(value).text(key).appendTo($exampleSelect);
            });

            $exampleButton.click();
        }
    }
    // #
});