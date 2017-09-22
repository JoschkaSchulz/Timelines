import fs from "fs";
import readline from "readline";

export default class TimelinesEditor {
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

  showTimelines() {
    var timelines = this.loadTimelines();
    for (var timeline in timelines) {
      var current = timelines[timeline];
      console.log(timeline, ": ", current.description);
      console.log("↳ ", current.days.join("|"));
    }
  }

  showOptions() {
    console.log("~[Timelines]~~~~~~~~~~~~~~~~~~");
    console.log("~~[a] Add new Timeline");
    console.log("~~[r] Remove a Timeline");
    console.log("~~[e] Exit");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

    this.input.question("What are you planning to do?: ", option => {
      switch (option) {
        default:
          this.input.close();
          break;
        case "a":
          this.showAddTimelineMenu();
          break;
        case "r":
          this.showRemoveTimelineMenu();
          break;
      }
    });
  }

  /* __________________________________________________________________________
   *      Menues
   */

  showTimelinesMenu() {
    this.showTimelines();
    this.showOptions();
  }

  showAddTimelineMenu() {
    var title = "⎕";
    var description = "No Label";
    var days = "";
    this.input.question("Please choose a title: ", t => {
      title = t;
      this.input.question("Please choose a description: ", desc => {
        description = desc;
        this.input.question(
          "Please tell the days comma seperated without spaces (mon, tue, wed, thu, fri, sat, sun): ",
          d => {
            days = d;
            this.addTimelineAction(title, description, days, () => {
              console.log("-> ", title, " wurde hinzugefügt!");
              this.showTimelinesMenu();
            });
          }
        );
      });
    });
  }

  showRemoveTimelineMenu() {
    var timelines = this.loadTimelines();
    this.showTimelines();
    this.input.question("Please choose a timeline: ", t => {
      if (timelines.hasOwnProperty(t)) {
        this.removeTimelineAction(t, this.showTimelineMenu);
      } else {
        this.showTimelineMenu();
      }
    });
  }

  /* __________________________________________________________________________
   *      Actions
   */

  addTimelineAction(title, description, days, callback) {
    var timelines = this.loadTimelines();
    timelines[title] = {
      description: description,
      days: days.split(",")
    };
    this.saveTimelines(timelines, callback.bind(this));
  }

  removeTimelineAction(title, callback) {
    var timelines = this.loadTimelines();
    delete timelines[title];
    this.saveTimelines(timelines, callback.bind(this));
  }

  /* __________________________________________________________________________
   *      File IO
   */

  loadTimelines() {
    var data = fs.readFileSync(this.configPath);
    var config = {};
    try {
      config = JSON.parse(data);
    } catch (err) {
      console.log("There has been an error parsing your JSON.");
    }
    return config;
  }

  saveTimelines(timelines, callback) {
    fs.writeFile(this.configPath, JSON.stringify(timelines), err => {
      if (err) {
        console.log("There has been an error saving your configuration data.");
        return;
      }
      callback();
    });
  }
}
