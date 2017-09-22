import fs from "fs";
import readline from "readline";

export default class LabelsEditor {
  constructor(configPath) {
    this.configPath = configPath;

    this.input = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /* __________________________________________________________________________
   *      Helper
   */

  showLabels() {
    var labels = this.loadLabels();
    for (var label in labels) {
      console.log(label, " - ", labels[label]);
    }
  }

  showOptions() {
    console.log("~[Labels]~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~[a] Add new Label");
    console.log("~~[r] Remove a Label");
    console.log("~~[e] Exit");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

    this.input.question("What are you planning to do?: ", option => {
      switch (option) {
        default:
          this.input.close();
          break;
        case "a":
          this.showAddLabelMenu();
          break;
        case "r":
          this.showRemoveLabelMenu();
          break;
      }
    });
  }

  /* __________________________________________________________________________
   *      Menues
   */

  showLabelsMenu() {
    this.showLabels();
    this.showOptions();
  }

  showAddLabelMenu() {
    var icon = "⎕";
    var label = "No Label";
    this.input.question("Please choose a icon: ", i => {
      icon = i;

      this.input.question("Please choose a label text: ", l => {
        label = l;

        this.addLabelAction(icon, label, () => {
          console.log("->", icon, " - ", label, " wurde hinzugefügt!");
          this.showLabelsMenu();
        });
      });
    });
  }

  showRemoveLabelMenu() {
    var labels = this.loadLabels();
    this.showLabels();
    this.input.question("Please choose a icon: ", i => {
      if (labels.hasOwnProperty(i)) {
        this.removeLabelAction(i, this.showLabelsMenu);
      } else {
        this.showLabelsMenu();
      }
    });
  }

  /* __________________________________________________________________________
   *      Actions
   */

  addLabelAction(icon, label, callback) {
    var labels = this.loadLabels();
    labels[icon] = label;
    this.saveLabels(labels, callback.bind(this));
  }

  removeLabelAction(icon, callback) {
    var labels = this.loadLabels();
    delete labels[icon];
    this.saveLabels(labels, callback.bind(this));
  }

  /* __________________________________________________________________________
   *      File IO
   */

  loadLabels() {
    var data = fs.readFileSync(this.configPath);
    var config = {};
    try {
      config = JSON.parse(data);
    } catch (err) {
      console.log("There has been an error parsing your JSON.");
    }
    return config;
  }

  saveLabels(labels, callback) {
    fs.writeFile(this.configPath, JSON.stringify(labels), err => {
      if (err) {
        console.log("There has been an error saving your configuration data.");
        return;
      }
      callback();
    });
  }
}
