/*
 * Copyright (c) 2018 19Labs Inc.. All rights reserved. 
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. 
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution. 
 * 
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// helper function for the webpage
function openTab(className, id) {
    $(".tab").hide();
    $(".measurement").hide();
    $(".files").hide();
    if (className === "measurement") {
        $("#measurements").show();
    } else if(className === "files") {
        $("#files").show();
    }
    $("#" + id).show();
}

// set the api key, if this is not set then no PII will be forwarded
function setApiKey() {
   //NineteenGale.setApiKey("229917BE7C3E9B2E88CD01627E2448B8C15572AC8B2C8452AAB8000F9DC92D09");
NineteenGale.setApiKey("CC7EF0386079F583ED5FBA8C6054A1130D34E6C4F299122120070569F9E3FBEA"); // noamwell
}

// set the receiver for login changed events
function onLoginChanged() {
    console.log("login changed");
    // getCurrent user information and pass to callback for display
    NineteenGale.getCurrentUser(showUser);
    NineteenGale.getSerial(showSerial)
    NineteenGale.getLocation(showLocation)
    onLanguageChanged();
    onSensorData();
    onIntakeData();
   
}
NineteenGale.setOnLoginChanged(onLoginChanged);

// set the receive for language changed events
function onLanguageChanged() {
    console.log("languaged changed")

    let language = NineteenGale.getCurrentLanguage();
    console.log("current href " + location.href);
    console.log("language " + language);

    const languageElement = $("#lang");
    console.log("lanaguage is " + language);
    if ((typeof languageElement !== 'undefined')&&(languageElement != null)) {
        if (language.indexOf("es") >= 0) {
            languageElement.text("Espanol");
        } else {
            languageElement.text("English");
        }
    }
    setLanguage(language);
}
NineteenGale.setOnLanguageChanged(onLanguageChanged);

function onSessionChanged(){
    console.log("session data changed");
    onLanguageChanged();
    onSensorData();
    onIntakeData();
}

// set receiver for session changed events
NineteenGale.setOnSessionChanged(onSessionChanged);

function onProxyComplete(code){
    console.log("proxy complete "+code);
    NineteenGale.getProxyResult(processResult);
}

function processResult(result){
    console.log("url result :"+JSON.stringify(result));
}

// set receiver for proxy complete events
NineteenGale.setOnProxyComplete(onProxyComplete);

let language = NineteenGale.getCurrentLanguage();


// set the reciever for sensor data events
function onSensorData() {
    // retreive the sensore data and pass to the callback
    console.log("call get Sensor Data");
    NineteenGale.getSensorData(showSensor);
}

function onSensorMeasurementData(data) {
    onSensorData();
}

NineteenGale.setOnSensorData(onSensorData);

NineteenGale.setOnSensorMeasurementData(onSensorMeasurementData);

function showSensor(data) {
    $("#sensor-data").text(JSON.stringify(data));
}

function showSerial(data) {
    $("#serial-data").text(data);
}

function showLocation(data) {
    $("#location-data").text(JSON.stringify(data));
}

function onIntakeData() {
     NineteenGale.getIntakeData(showIntake);
}

// set reciever for intake data event
NineteenGale.setOnIntakeData(onIntakeData);

function showIntake(data) {
    $("#intake-data").text(JSON.stringify(data));
    if (typeof data.healthHistory !== 'undefined') {
        if (typeof data.healthHistory.allergies !== 'undefined'){
            $("#allergies").val(data.healthHistory.allergies);
        }
        if (typeof data.healthHistory.conditions !== 'undefined'){
            $("#conditions").val(data.healthHistory.conditions);
        }
        if (typeof data.healthHistory.medications !== 'undefined'){
            $("#medications").val(data.healthHistory.medications);
        }
        if (typeof data.healthHistory.medicalHistory !== 'undefined'){
            $("#medical-history").val(data.healthHistory.medicalHistory);
        }
    }
}

NineteenGale.setOnAPIError(console.log);

function showUser(user) {
    console.log("Show user")
    if (user == null){
        user = {}
    }
    const userElement = $("#user");
   
    const intake = NineteenGale.getIntakeData(showIntake);
    showIntake(intake);
    if ((typeof userElement != 'undefined') && (userElement != null)) {
        if (!jQuery.isEmptyObject(user)) {
            userElement.text("Welcome " + user.firstName + " " + user.lastName);
        } else {
            userElement.text(JSON.stringify(user));
        }
    }
}

// Navigate to different pages on the Gale App

function showSensors() {
    NineteenGale.showSensors();
}

function showWellness() {
    NineteenGale.showWellness();
}

function showLogin(){
    NineteenGale.showLogin();
}

function showCallCenter(){
    NineteenGale.showCallCenter();
}

function showCallCenter(){
    NineteenGale.showIntake();
}

function showClinic(name){
    NineteenGale.showClinic(name);
}

function stopVideo(){
    
}

// open a clinic using the clinics name
function selectClinic(){
    const clinic =  $("#clinic");
    console.log('Select clinic ' +clinic.val());
    NineteenGale.showClinic(clinic.val())
  }

// add sensor data from a manual sensor entry

function addBloodPressureData() {
    const highPressure = $("#sys").val();
    const lowPressure = $("#dia").val();
    const pulse = $("#pulse").val();
    NineteenGale.addBloodPressureData({highPressure, lowPressure, pulse});
}

function addPulseOxData() {
    const oxygen = $("#oxygen").val();
    const pulse = $("#pulse-ox-pulse").val();
    const perfusion = $("#perfusion").val();
    const respirationRate = $("#respirationRate").val();
    NineteenGale.addPulseOxData({oxygen, pulse, perfusion, respirationRate});
}

function addThermometerData() {
    const temperature = $("#temp").val();
    const unit = $("#thermometer-unit").val();
    NineteenGale.addThermometerData({temperature, unit});
}

function addGlucometerData() {
    const bloodSugar = $("#glucometer-blood-sugar").val();
    const unit = $("#glucometer-unit").val();
    NineteenGale.addGlucometerData({bloodSugar, unit});
}

function addWeightScaleData() {
    const weight = $("#weight").val();
    const unit = $("#weight-scale-unit").val();
    const bmi = $("#bmi").val();
    NineteenGale.addWeightScaleData({weight, unit, bmi});
}

function addSpirometerData() {
    const pef = $("#pef").val();
    const fvc = $("#fvc").val();
    const fef2575 = $("#fef2575").val();
    const fev6 = $("#fev6").val();
    const fev1 = $("#fev1").val();
    const fev1_fvc = $("#fev1-fvc").val();

    const measurements = [{ "label": "PEF", "value": pef, "unit": "L/m" }, 
        { "label": "FVC", "value": fvc, "unit": "L" },
        { "label": "FEF2575", "value": fef2575, "unit": "L" },
        { "label": "FEV6", "value": fev6, "unit": "L" },
        { "label": "FEV1", "value": fev1, "unit": "L" },
        { "label": "FEV1_FVC", "value": fev1_fvc, "unit": "%" }];

    for (i in measurements) {
        NineteenGale.addSpirometerData({"label": measurements[i].label, "value": measurements[i].value, "unit": measurements[i].unit});
    }
}

function addMultifunctionData() {
    const bloodSugar = $('#multifunction-blood-sugar').val();
    const keytone = $('#keytone').val();
    const lactate = $('#lactate').val();
    const cholesterol = $('#cholesterol').val();
    const uricAcid = $('#uric-acid').val();

    let bloodSugarUnit = "";
    if ($('#mg-dL').prop('checked')) {
        bloodSugarUnit = "mg/dL";
    } else {
        bloodSugarUnit = "mmol/L";
    }

    const measurements = [{ "label": "BLOOD_SUGAR", "value": bloodSugar, "unit": bloodSugarUnit },
    { "label": "KETONE", "value": keytone, "unit": "mmol/L" },
    { "label": "LACTATE", "value": lactate, "unit": "mmol/L" },
    { "label": "CHOLESTEROL", "value": cholesterol, "unit": "mg/dL" },
    { "label": "URIC_ACID", "value": uricAcid, "unit": "mg/dL" }];

    for (i in measurements) {
        NineteenGale.addMultifunctionData({"label": measurements[i].label, "value": measurements[i].value, "unit": measurements[i].unit});
    }
}

//helper functions to display data on the webpage

function displayClinics(obj) {
    let clinics = "";
    for (let i = 0; i < obj.length; i++) {
        clinics = clinics.concat(obj[i].displayname + "\n");
    }
    $("#clinic-display").val(clinics);
}

function displaySensors(obj) {
    let sensors = "";
    for (let i = 0; i < obj.length; i++) {
        sensors = sensors.concat(obj[i].name + "\n");
    }
    $("#sensor-list-box").val(sensors);
}


// manually set a measurement from a manually set device
function setMeasurement() {
    const name = $("#name").val();
    const value = $("#value").val();
    const units = $("#units").val();
    const device = $("#device").val();
    NineteenGale.setMeasurement({name, value, units, device});
}

// set a note
function setNote() {
    const note = $("#note").val();
    NineteenGale.setNote(note);
}

// set intake data
function setIntake() {
    const firstName = $("#first-name").val();
    const lastName = $("#last-name").val();
    const dateofBirth = $("#date").val();
    const genderIndex = $("#gender").prop('selectedIndex');
    const gender = $("#gender").find(":selected").text();
    const personalInfo = {"firstName" : firstName, "lastName" : lastName, "dateOfBirth" : dateofBirth, "gender" : gender, "genderIndex" : genderIndex, "cardId" : ""};

    const hasInsurance = $("#has-insurance").is(':checked');
    const noInsurance = $("#no-insurance").is(':checked');
    const insurancePlanNotListed = $("#insurance-plan-not-listed").is(':checked');
    const insuranceName = $("#insurance-name").val();
    const insuranceID = $("#insurance-ID").val();
    let insurance = ""
    if (hasInsurance) {
        insurance = { "hasInsurance" : hasInsurance, "noInsurance" : noInsurance, "insurancePlanNotListed" : insurancePlanNotListed, "insuranceName" : insuranceName, "insuranceID" : insuranceID};
    } else {
        insurance = { "hasInsurance" : hasInsurance, "noInsurance" : noInsurance, "insurancePlanNotListed" : insurancePlanNotListed, "insuranceName" : "", "insuranceID" : "" };
    }

    const guestVisitNotes = $("#guest-visit-notes").val();

    let cm = "";
    let inch = "";
    let ft = "";
    let heightUnit = ""
    let weightUnit = "";
    let weight = "";
    if ($("#imperial-height").is(':checked')) {
        heightUnit = "ft";
        inch = $("#inch").val();
        ft = $("#ft").val();
    } else {
        heightUnit = "cm";
        cm = $("#cm").val();
    }

    if ($("#imperial-weight").is(':checked')) {
        weight = $("#lbs").val();
        weightUnit = "lbs";
    } else {
        weight = $("#kg").val();
        weightUnit = "kg";
    }
    const patientPhysiqueInfo = {"height" : {"cm" : cm, "feet" : ft, "inch" : inch, "heightUnit" : heightUnit}, "weight" : {"weight" : weight, "weightUnit" : weightUnit}};

    
    const intake = {personalInfo, insurance, guestVisitNotes, patientPhysiqueInfo};
    NineteenGale.setIntake(JSON.stringify(intake));
    onIntakeData();
}

// set the health history
function setIntakeHealthHistory() {
    const allergies = $("#allergies").val();
    const medications = $("#medications").val();
    const conditions = $("#conditions").val();
    const medicalHistory = $("#medical-history").val();
    const healthHistory = { "allergies": allergies, "medications": medications, "conditions": conditions, "medicalHistory": medicalHistory };
    NineteenGale.setIntakeHealthHistory(JSON.stringify(healthHistory));
}

function getPdfData() {
    NineteenGale.getPdfData(showPdfData);
}

function showPdfData(data) {
    $("#pdf-data-text").text(JSON.stringify(data));
    let text = "No pdfs";
    if (!jQuery.isEmptyObject(data)) {
        text = data[Object.keys(data)[0]][0].uri;
    }
    $("#pdf-uri-text").val(text);
}

function getPdfByUri() {
    let uri = $("#pdf-uri-text").val();
    NineteenGale.getPdfByUri(uri, showPDFReference);
}

function showPDFReference(uri) {
    $("#pdf-reference-text").val(uri);
}

function getMeasurementFileData() {
    NineteenGale.getMeasurementFileData(showMeasurementData);
}

function showMeasurementData(data) {
    $("#measurement-file-data-text").text(JSON.stringify(data));
    let text = "No measurements";
    if (!jQuery.isEmptyObject(data)) {
        text = data[Object.keys(data)[0]][0].uri;
    }
    $("#measurement-file-uri-text").val(text);
}

function getMeasurementFileByUri() {
    let uri = $("#measurement-file-uri-text").val();
    NineteenGale.getMeasurementFileByUri(uri, showMeasurementReference);
}

function showMeasurementReference(uri) {
    $("#measurement-file-reference-text").val(uri);
}