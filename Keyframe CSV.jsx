var panelGlobal = this;
var palette = (function () {

    var csvFile;

    // PALETTE
    // =======
    var palette = (panelGlobal instanceof Panel) ? panelGlobal : new Window("palette", undefined, undefined, { resizeable: true });
        if (!(panelGlobal instanceof Panel)) palette.text = "Keyframe CSV";
        palette.orientation = "column";
        palette.alignChildren = ["center", "center"];
        palette.spacing = 10;
        palette.margins = 16;

    // TIMEGROUP
    // =========
    var timeGroup = palette.add("group", undefined, { name: "timeGroup" });
        timeGroup.orientation = "row";
        timeGroup.alignChildren = ["left", "center"];
        timeGroup.spacing = 10;
        timeGroup.margins = 0;

    var timeText = timeGroup.add("statictext", undefined, undefined, { name: "timeText" });
        timeText.text = "Time Column";

    var timeInput = timeGroup.add('edittext {properties: {name: "timeInput"}}');
        timeInput.preferredSize.width = 35;

    // MISCGROUP
    // =========
    var miscGroup = palette.add("group", undefined, { name: "miscGroup" });
        miscGroup.orientation = "row";
        miscGroup.alignChildren = ["left", "center"];
        miscGroup.spacing = 10;
        miscGroup.margins = 0;

    var miscText = miscGroup.add("statictext", undefined, undefined, { name: "miscText" });
        miscText.text = "Value Column";

    var miscInput = miscGroup.add('edittext {properties: {name: "miscInput"}}');
        miscInput.preferredSize.width = 35;

    var valueIsString = palette.add("checkbox", undefined, undefined, { name: "valueIsString" });
        valueIsString.text = "Value is a string";

    // ROWSGROUP
    // =========
    var rowsGroup = palette.add("group", undefined, { name: "rowsGroup" });
        rowsGroup.orientation = "row";
        rowsGroup.alignChildren = ["left", "center"];
        rowsGroup.spacing = 10;
        rowsGroup.margins = 0;

    var rowText = rowsGroup.add("statictext", undefined, undefined, { name: "rowText" });
        rowText.text = "Rows From:";

    var rowFrom = rowsGroup.add('edittext {properties: {name: "rowFrom"}}');
        rowFrom.preferredSize.width = 42;
        rowFrom.helpTip = "Recommend to only\n run 100 rows at a time";

    var rowText2 = rowsGroup.add("statictext", undefined, undefined, { name: "rowText2" });
        rowText2.text = "To: ";

    var rowTo = rowsGroup.add('edittext {properties: {name: "RowTo"}}');
        rowTo.preferredSize.width = 43;

    // BUTTONS
    // =======
    var buttons = palette.add("group", undefined, { name: "buttons" });
        buttons.orientation = "row";
        buttons.alignChildren = ["left", "center"];
        buttons.spacing = 10;
        buttons.margins = 0;

    var chooseFile = buttons.add("button", undefined, undefined, { name: "chooseFile" });
        chooseFile.text = "Choose File...";
        chooseFile.onClick = function () {
            csvFile = File.openDialog("Choose CSV to import");
        }

    var runButton = buttons.add("button", undefined, undefined, { name: "runButton" });
        runButton.text = "Run";
        runButton.onClick = function () { run() };

    palette.layout.layout(true);
    palette.layout.resize();
    palette.onResizing = palette.onResize = function () { this.layout.resize(); }

    if (palette instanceof Window) palette.show();

    function run() {

        var comp = app.project.activeItem;
        var layer = comp.selectedLayers;
        var CSVRows = [];

        if (csvFile == undefined) {
            alert("Please pick a file to import")
            return false
        }

        if (timeInput.text == "" || miscInput.text == "") {
            alert("Please input columns to import")
            return false
        }

        if (layer.length == 0 || layer[0].selectedProperties.length == 0) {
            alert("Please pick a property");
            return false
        }

        var timeColumn = parseInt(timeInput.text);
        var miscColumn = parseInt(miscInput.text);



        var time = [];
        var misc = [];

        csvFile.open("r");

        do {
            CSVRows.push(csvFile.readln());
        } while (!csvFile.eof);

        csvFile.close();

        var from = (rowFrom.text == "" || parseInt(rowFrom.text) <= 0) ? 1 : parseInt(rowFrom.text);
        var to = (rowTo.text == "" || parseInt(rowTo.text) > CSVRows.length) ? CSVRows.length : parseInt(rowTo.text);

        var property = layer[0].selectedProperties[0];

        for (var i = from; i < to; i++) {
            time.push(parseFloat(CSVRows[i].split(",")[timeColumn].replace(/"/g, "")));
            var miscFloatString = CSVRows[i].split(",")[miscColumn].replace(/"/g, "")

            if (valueIsString.value == false) {
                miscFloatString = parseFloat(miscFloatString);
            }

            misc.push(miscFloatString);
        }
        property.setValuesAtTimes(time, misc);
    }

}());
