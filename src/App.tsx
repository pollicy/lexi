import pollicyLogo from "./assets/pollicy-favicon.webp";
import "./App.css";

function App() {
  async function handleClick() {
    const abusiveWords = ["badword1", "badword2", "example"];

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      args: [abusiveWords],
      func: (words) => {
        // recursive function to go through every node on the page's DOM
        const walk = (node: Node) => {
          // Type 3 = a text node — actual words inside a paragraph (<p>), not the tags themselves
          if (node.nodeType === 3) {
            let text = node.nodeValue!;
            let replaced = text;
            words.forEach((word) => {
              const regex = new RegExp(`\\b(${word})\\b`, "gi");
              replaced = replaced.replace(
                regex,
                `<span style="background-color: red; color: white; padding: 2px; border-radius: 3px;">$1</span>`
              );
            });
            if (replaced !== text) {
              const span = document.createElement("span");
              span.innerHTML = replaced;
              node.parentNode?.replaceChild(span, node);
            }
          } else {
            node.childNodes.forEach(walk);
          }
        };

        walk(document.body);
      },
    });
  }

  return (
    <>
      <div>
        <a href="https://pollicy.org" target="_blank">
          <img src={pollicyLogo} className="logo react" alt="Pollicy logo" />
        </a>
      </div>
      <h1>Lexi by Pollicy</h1>
      <div className="card">
        <button onClick={handleClick}>Click Here To Moderate Page</button>
      </div>
      <p className="read-the-docs">
        Lexi is a browser extension that brings Pollicy's Lexicon Tool
        capabilities to browsers for content moderation.{" "}
      </p>
    </>
  );
}

export default App;
