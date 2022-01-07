import React from "react";

export class Tool extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", result: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  convertToGrid(input) {
    // https://help.miro.com/hc/en-us/articles/360017572054-Sticky-notes
    // According to this page, you can only paste up to 50 rows and 100 columns.

    const list = input
      .map((row) => row.trim())
      .filter((row) => row !== "")
      .filter((row) => row.length <= 6000);

    return {
      text: list.join("\t"),
      count: input.length,
    };
  }

  setResult(result) {
    this.setState({ result });
    return;
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    const input = this.state.value;
    const lines = input.split("\n");

    if (lines.length > 5000) {
      this.setResult(
        `Too many lines. You entered ${lines.length} but you're only allowed up to 5000.`
      );
    } else {
      const result = this.convertToGrid(lines);
      navigator.clipboard.writeText(result.text).then(
        () => {
          this.setResult(`Copied ${result.count} stickies to clipboard!`);
        },
        function (err) {
          this.setResult("Error copying to clipboard");
        }
      );
    }
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h1>Miro sticky-ifier</h1>
        <p>Convert a list into sticky notes you can paste into Miro.</p>
        <form onSubmit={this.handleSubmit}>
          {" "}
          <label>
            <textarea
              value={this.state.value}
              cols="50"
              rows="20"
              onChange={this.handleChange}
            />{" "}
          </label>
          <br />
          <input type="submit" value="Copy" />
        </form>
        <h2>{this.state.result}</h2>
      </div>
    );
  }
}
