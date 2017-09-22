import app from "commander";

import LabelEditor from "./labels.js";
import TimelinesEditor from "./timelines.js";

let labelsConfigPath = "config/labels.json";
let timelinesConfigPath = "config/timelines.json";

app
  .version("0.1.0")
  //.option("-a --add", "Add a new entry")
  .option("-l --labels", "Edit the labels")
  .option("-t, --timelines", "Edit the timelines")
  .parse(process.argv);

if (app.add) {
  console.log("~[Add]~~~~~~~~~~~~~~~~~~~~~~~~");
} else if (app.timelines) {
  let timelinesEditor = new TimelinesEditor(timelinesConfigPath);
  timelinesEditor.showTimelinesMenu();
} else if (app.labels) {
  let labelsEditor = new LabelEditor(labelsConfigPath);
  labelsEditor.showLabelsMenu();
} else if (app.timeline) {
}
