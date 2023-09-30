import { AutoCompleteTextBox, AutoCompleteTextBoxOption } from "./AutoCompleteTextBox/AutoCompleteTextBox";
import "./Content.css";
const allValues: AutoCompleteTextBoxOption[] = [
  {
    label: "Apple",
    value: "apple",
  },
  {
    label: "Banana",
    value: "banana",
  },
  {
    label: "Cherry",
    value: "cherry",
  },
  {
    label: "Durian",
    value: "durian",
  },
  {
    label: "Elderberry",
    value: "elderberry",
  },
  {
    label: "Fig",
    value: "fig",
  },
  {
    label: "Grape",
    value: "grape",
  },
  {
    label: "Honeydew",
    value: "honeydew",
  },
  {
    label: "Jackfruit",
    value: "jackfruit",
  },
  {
    label: "Kiwi",
    value: "kiwi",
  },
  {
    label: "Lemon",
    value: "lemon",
  },
  {
    label: "Mango",
    value: "mango",
  },
];

export function Content() {
  // Code to generate 200 paragraphs of content to overflow the page vertically
  const contentItems = [];
  for (let i = 0; i < 10; i++) {
    contentItems.push(<p key={i}>Content: {i}</p>);
  }
  return (
    <div className="content">
      <AutoCompleteTextBox
        options={allValues}
        onSelect={(option: AutoCompleteTextBoxOption | undefined) => {
          if (option) {
            console.log("Selected the option", option);
          }
        }}
      />
      <br />
      {contentItems}
    </div>
  );
}
