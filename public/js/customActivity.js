define(['postmonger'], function (Postmonger) {
    'use strict';

    let connection = new Postmonger.Session();
    let authTokens = {};
    let payload = {};
    let campaignCode = '';
    let mobileNumber = '';

    // Configuration variables
    let eventSchema = ''; // variable is used in parseEventSchema()
    let lastnameSchema = ''; // variable is used in parseEventSchema()
    let eventDefinitionKey;

    $(window).ready(onRender);
    connection.on('initActivity', initialize);
    connection.on('clickedNext', save); //Save function within MC

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

        $("#campaignCode").on("input", function(){
            campaignCode = $("#campaignCode").val();
            if (campaignCode.length > 0) {
              connection.trigger("updateButton", { button: "next", text: "done", visible: true, enabled: true });
            }else {
              connection.trigger("updateButton", { button: "next", text: "done", visible: true, enabled: false });
            }
        });
    }

    /**
     * This function is to pull out the event definition within journey builder.
     * With the eventDefinitionKey, you are able to pull out values that passes through the journey
     */
    connection.trigger('requestTriggerEventDefinition');
    connection.on('requestedTriggerEventDefinition', function (eventDefinitionModel) {
        if (eventDefinitionModel) {
            eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
            console.log('Request Trigger >>>', JSON.stringify(eventDefinitionModel));
        }
    });

    function initialize(data) {
        if (data) {
            payload = data;
        }
        initialLoad(data);
        // parseEventSchema();
    }

    /**
     * Save function is fired off upon clicking of "Done" in Marketing Cloud
     * The config.json will be updated here if there are any updates to be done via Front End UI
     */
    function save() {
        console.log("Saved called");
        campaignCode = $("#campaignCode").val();
        mobileNumber = $("#mobileNumber").val();

        // 'payload' is initialized on 'initActivity' above.
        // Journey Builder sends an initial payload with defaults
        // set by this activity's config.json file.  Any property
        // may be overridden as desired.
    
        payload["arguments"].execute.inArguments.push({ campaignCode: campaignCode, mobileNumber: mobileNumber });
        payload["metaData"].isConfigured = true;
        connection.trigger("updateActivity", payload);
        console.log(payload);

    }

    /**
     * 
     * @param {*} data
     * 
     * This data param is the config json payload that needs to be loaded back into the UI upon opening the custom application within journey builder 
     * This function is invoked when the user clicks on the custom activity in Marketing Cloud. 
     * If there are information present, it should be loaded back into the appropriate places. 
     * e.g. input fields, select lists
     */
    function initialLoad(data) {
        if (data) {
            payload = data;
        }
        console.log(payload);
      
        let hasInArguments = Boolean(
            payload["arguments"] &&
            payload["arguments"].execute &&
            payload["arguments"].execute.inArguments &&
            payload["arguments"].execute.inArguments.length > 0
        );
      
        let inArguments = hasInArguments
            ? payload["arguments"].execute.inArguments
            : {};
      
        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                if (key === "campaignCode") {
                    campaignCode = val;
                }
                if (key === "mobileNumber") {
                    mobileNumber = val;
                }
            });
        });
      
        // If there is no message selected, disable the next button
        if (!campaignCode) {
            connection.trigger("updateButton", { button: "next", text: "done", visible: true, enabled: false });
            // If there is a message, skip to the summary step
        }else {
            $("#campaignCode").val(campaignCode);
            $("#mobileNumber").val(mobileNumber);
          }
        };


    /**
     * This function is to pull the relevant information to create the schema of the objects
     * 
     * This function pulls out the schema for additional customizations that can be used.
     * This function leverages on the required field of "Last Name" to pull out the overall event schema
     * 
     * returned variables of: lastnameSchema , eventSchema.
     * eventSchema = Case:Contact:
     * lastnameSchema = Case:Contact:<last_name_schema>
     * 
     * View the developer console in chrome upon opening of application in MC Journey Builder for further clarity.
     */
    function parseEventSchema() {
        // Pulling data from the schema
        /*connection.trigger('requestSchema');
        connection.on('requestedSchema', function (data) {
            // save schema
            let dataJson = data['schema'];

            for (let i = 0; i < dataJson.length; i++) {

                // Last name schema and creation of event schema
                // Last name is a required field in SF so this is used to pull the event schema
                if (dataJson[i].key.toLowerCase().replace(/ /g, '').indexOf("lastname") !== -1) {
                    let splitArr = dataJson[i].key.split(".");
                    lastnameSchema = splitArr[splitArr.length - 1];
                    console.log('Last Name Schema >>', lastnameSchema);

                    let splitName = lastnameSchema.split(":");
                    let reg = new RegExp(splitName[splitName.length - 1], "g");
                    let oldSchema = splitArr[splitArr.length - 1];

                    eventSchema = oldSchema.replace(reg, "");
                    console.log("Event Schema >>", eventSchema);
                }
            }

        });*/
    }
});