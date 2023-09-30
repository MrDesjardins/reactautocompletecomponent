

export function Content() {

  // Code to generate 200 paragraphs of content to overflow the page vertically
  const contentItems = [];
  for (let i = 0; i < 200; i++) {
    contentItems.push(<p key={i}>Content: {i}</p>);
  }
  return <div className="content">{contentItems}</div>;
}